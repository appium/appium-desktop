import Bluebird from 'bluebird';
import wd from 'wd';

const isDevelopment = process.env.NODE_ENV === 'development';

const KEEP_ALIVE_PING_INTERVAL = 5 * 1000;
const NO_NEW_COMMAND_LIMIT = isDevelopment ?  30 * 1000 :  5 * 60 * 1000;
const WAIT_FOR_USER_KEEP_ALIVE = 30 * 1000;

export default class AppiumMethodHandler {
  constructor (driver, sender) {
    this.driver = driver;
    this.sender = sender;
    this.elementCache = {};
    this.elVariableCounter = 1;
    this.elArrayVariableCounter = 1;
    this._lastActiveMoment = +(new Date());
  }

  /**
   * Ping server every 30 seconds to prevent `newCommandTimeout` from killing session
   */
  runKeepAliveLoop () {
    this.keepAlive = setInterval(() => {
      this.driver.sessionCapabilities(); // Pings the Appium server to keep it alive
      const now = +(new Date());

      // If the new command limit has been surpassed, prompt user if they want to keep session going
      // Give them 30 seconds to respond
      if (now - this._lastActiveMoment > NO_NEW_COMMAND_LIMIT) {
        this.sender.send('appium-prompt-keep-alive');

        // After the time limit kill the session (this timeout will be killed if they keep it alive)
        this.waitForUserTimeout = setTimeout(() => {
          this.close('Session closed due to inactivity');
        }, WAIT_FOR_USER_KEEP_ALIVE);
      }
    }, KEEP_ALIVE_PING_INTERVAL);
  }

  /**
   * Get rid of the intervals to keep the session alive
   */
  killKeepAliveLoop () {
    clearInterval(this.keepAlive);
    if (this.waitForUserTimeout) {
      clearTimeout(this.waitForUserTimeout);
    }
  }

  /**
   * Reset the new command clock and kill the wait for user timeout
   */
  keepSessionAlive () {
    this._lastActiveMoment = +(new Date());
    if (this.waitForUserTimeout) {
      clearTimeout(this.waitForUserTimeout);
    }
  }

  async fetchElement (strategy, selector) {
    let element = await this.driver.elementOrNull(strategy, selector);
    if (element === null) {
      return {};
    }
    let id = element.value;

    // Cache this ID along with its variable name, variable type and strategy/selector
    let cachedEl = this.elementCache[id] = {
      el: element,
      variableType: 'string',
      strategy,
      selector,
      id,
    };

    return {
      ...cachedEl,
      strategy,
      selector,
      id,
    };
  }

  async fetchElements (strategy, selector) {
    let els = await this.driver.elements(strategy, selector);

    let variableName = `els${this.elArrayVariableCounter++}`;
    let variableType = 'array';

    // Cache the elements that we find
    let elements = els.map((el, index) => {
      const res = {
        el,
        variableName,
        variableIndex: index,
        variableType: 'string',
        id: el.value,
        strategy,
        selector,
      };
      this.elementCache[el.value] = res;
      return res;
    });
    
    return {variableName, variableType, strategy, selector, elements};
  }

  async _execute ({elementId, methodName, args, skipScreenshotAndSource}) {
    this._lastActiveMoment = +(new Date());
    let cachedEl;
    let res = {};

    if (elementId) {
      // Give the cached element a variable name (el1, el2, el3,...) the first time it's used
      cachedEl = this.elementCache[elementId];
      if (!cachedEl.variableName && cachedEl.variableType === 'string') {
        cachedEl.variableName = `el${this.elVariableCounter++}`;
      }
      res = await cachedEl.el[methodName].apply(cachedEl.el, args);
    } else {
       // Specially handle the tap and swipe method
      if (methodName === 'tap') {
        res = await (new wd.TouchAction(this.driver))
          .tap({x: args[0], y: args[1]})
          .perform();
      } else if (methodName === 'swipe') {
        const [startX, startY, endX, endY] = args;
        res = await (new wd.TouchAction(this.driver))
          .press({x: startX, y: startY})
          .moveTo({x: endX, y: endY})
          .release()
          .perform();
      } else if (methodName !== 'source' && methodName !== 'screenshot') {
        res = await this.driver[methodName].apply(this.driver, args);
      }
    }

    // Give the source/screenshot time to change before taking the screenshot
    await Bluebird.delay(500);

    let sourceAndScreenshot;
    if (!skipScreenshotAndSource) {
      sourceAndScreenshot = await this._getSourceAndScreenshot();
    }

    return {
      ...sourceAndScreenshot,
      ...cachedEl,
      res,
    };
  }

  async executeElementCommand (elementId, methodName, args = [], skipScreenshotAndSource = false) {
    return await this._execute({elementId, methodName, args, skipScreenshotAndSource});
  }

  async executeMethod (methodName, args = [], skipScreenshotAndSource = false) {
    return await this._execute({methodName, args, skipScreenshotAndSource});
  }
  
  async _getSourceAndScreenshot () {
    let source, sourceError, screenshot, screenshotError, windowSize, windowSizeError;
    try {
      source = await this.driver.source();
    } catch (e) {
      if (e.status === 6) {
        throw e;
      }
      sourceError = e;
    }

    try {
      screenshot = await this.driver.takeScreenshot();
    } catch (e) {
      if (e.status === 6) {
        throw e;
      }
      screenshotError = e;
    }
    
    try {
      windowSize = await this.driver.getWindowSize();
      
    } catch (e) {
      if (e.status === 6) {
        throw e;
      }
      windowSizeError = e;
    }

    return {source, sourceError, screenshot, screenshotError, windowSize, windowSizeError};
  }

  restart () {
    // Clear the variable names and start over (el1, el2, els1, els2, etc...)
    for (const elCache of Object.values(this.elementCache)) {
      delete elCache.variableName;
    }

    // Restart the variable counter
    this.elVariableCounter = 1;
    this.elArrayVariableCounter = 1;   
  }

  async close (reason, killedByUser=false) {
    this.killKeepAliveLoop();
    this.sender.send('appium-session-done', {reason, killedByUser});
    if (!this.driver._isAttachedSession) {
      try {
        await this.driver.quit();
      } catch (ign) { }
    }
  }

}
