import Bluebird from 'bluebird';
import wd from 'wd';
import log from 'electron-log';
import _ from 'lodash';
import { SCREENSHOT_INTERACTION_MODE } from '../renderer/components/Inspector/shared';

const isDevelopment = process.env.NODE_ENV === 'development';

const KEEP_ALIVE_PING_INTERVAL = 5 * 1000;
const NO_NEW_COMMAND_LIMIT = isDevelopment ? 30 * 1000 : 24 * 60 * 60 * 1000; // Set timeout to 24 hours
const WAIT_FOR_USER_KEEP_ALIVE = 60 * 60 * 1000; // Give user 1 hour to reply

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
    if (!_.isArray(args)) {
      args = [args];
    }

    if (elementId) {
      // Give the cached element a variable name (el1, el2, el3,...) the first time it's used
      cachedEl = this.elementCache[elementId];
      if (!cachedEl.variableName && cachedEl.variableType === 'string') {
        cachedEl.variableName = `el${this.elVariableCounter++}`;
      }
      res = await cachedEl.el[methodName].apply(cachedEl.el, args);
    } else {
      // Specially handle the tap and swipe method
      if (methodName === SCREENSHOT_INTERACTION_MODE.TAP) {
        res = await (new wd.TouchAction(this.driver))
          .tap({x: args[0], y: args[1]})
          .perform();
      } else if (methodName === SCREENSHOT_INTERACTION_MODE.SWIPE) {
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

    /* eslint-disable promise/catch-or-return */
    return await new Bluebird((resolve) => {
      let res = {};

      // Resolve when we have source/sourceError, screenshot/screenshotError and windowSize/windowSizeError
      // NOTE: Couldn't use Promise.all here because Promise.all fails when it encounters just one error. In this
      // case we need it to finish all of the promises and get either the response or the error for each
      const checkShouldResolve = () => {
        if (
          (res.source || res.sourceError) &&
          (res.screenshot || res.screenshotError) &&
          (res.windowSize || res.windowSizeError)
        ) {
          resolve(res);
        }
      };

      this.driver.source()
        .then((source) => (res.source = source) && checkShouldResolve())
        .catch((sourceError) => (res.sourceError = sourceError) && checkShouldResolve());

      this.driver.takeScreenshot()
        .then((screenshot) => (res.screenshot = screenshot) && checkShouldResolve())
        .catch((screenshotError) => (res.screenshotError = screenshotError) && checkShouldResolve());

      this.driver.getWindowSize()
        .then((windowSize) => (res.windowSize = windowSize) && checkShouldResolve())
        .catch((windowSizeError) => (res.windowSizeError = windowSizeError) && checkShouldResolve());
    });
    /* eslint-enable promise/catch-or-return */
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

  async close (reason, killedByUser = false) {
    this.killKeepAliveLoop();
    this.sender.send('appium-session-done', {reason, killedByUser});
    if (!this.driver._isAttachedSession) {
      try {
        await this.driver.quit();
      } catch (ign) { }
    }
  }
}

export function createSession (driver, sender, winId) {
  const {appiumHandlers} = AppiumMethodHandler;
  log.info(`Creating method handler for session with window id: ${winId}`);
  const handler = AppiumMethodHandler.appiumHandlers[winId] = new AppiumMethodHandler(driver, sender);
  log.info(`The following session window ID's have active sessions: '${JSON.stringify(_.keys(appiumHandlers))}'`);
  return handler;
}

export function killSession (winId, killedByUser) {
  const {appiumHandlers} = AppiumMethodHandler;
  const handler = appiumHandlers[winId];
  delete AppiumMethodHandler.appiumHandlers[winId];
  log.info(`Killing session for window with id: ${winId}`);

  if (handler) {
    handler.close('', killedByUser);
  }

  log.info(`Deleted session for window with id: ${winId}`);
  log.info(`The following session window ID's have active sessions: '${JSON.stringify(_.keys(appiumHandlers))}'`);
}

export function getSessionHandler (winId) {
  log.info(`Retrieving session for window with id: ${winId}`);
  const {appiumHandlers} = AppiumMethodHandler;
  const handler = appiumHandlers[winId];
  if (handler) {
    return handler;
  } else {
    log.error(`Could not find session with window id '${winId}'. Availalable sessions are: '${JSON.stringify(_.keys(appiumHandlers))}'`);
    return false;
  }
}

AppiumMethodHandler.appiumHandlers = {};
