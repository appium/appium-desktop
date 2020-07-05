import Bluebird from 'bluebird';
import wd from 'wd';
import log from 'electron-log';
import _ from 'lodash';
import { timing } from 'appium-support';
import { SCREENSHOT_INTERACTION_MODE } from '../renderer/components/Inspector/shared';
import {getWebviewStatusAddressBarHeight, parseSource, setHtmlElementAttributes} from './webviewHelpers';

const isDevelopment = process.env.NODE_ENV === 'development';
const NATIVE_APP = 'NATIVE_APP';

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
    const timer = new timing.Timer().start();
    let element = await this.driver.elementOrNull(strategy, selector);
    const duration = timer.getDuration();
    const executionTime = Math.round(duration.asMilliSeconds);

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
      executionTime,
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

  async _execute ({elementId, methodName, args, skipRefresh}) {
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
          .wait(500)
          .moveTo({x: endX, y: endY})
          .release()
          .perform();
      } else if (methodName !== 'source' && methodName !== 'screenshot') {
        res = await this.driver[methodName].apply(this.driver, args);
      }
    }

    // Give the source/screenshot time to change before taking the screenshot
    await Bluebird.delay(500);

    let contextsSourceAndScreenshot;
    if (!skipRefresh) {
      contextsSourceAndScreenshot = await this._getContextsSourceAndScreenshot();
    }

    return {
      ...contextsSourceAndScreenshot,
      ...cachedEl,
      res,
    };
  }

  async executeElementCommand (elementId, methodName, args = [], skipRefresh = false) {
    return await this._execute({elementId, methodName, args, skipRefresh});
  }

  async executeMethod (methodName, args = [], skipRefresh = false) {
    return await this._execute({methodName, args, skipRefresh});
  }

  async _getContextsSourceAndScreenshot () {
    let contexts, contextsError, currentContext, currentContextError, platformName,
        source, sourceError, screenshot, screenshotError, statBarHeight, windowSize, windowSizeError;

    try {
      currentContext = await this.driver.currentContext();
    } catch (e) {
      if (e.status === 6) {
        throw e;
      }
      currentContextError = e;
    }

    // Note: These methods need to be executed in the native context because ChromeDriver behaves differently
    if (currentContext !== NATIVE_APP) {
      await this.driver.context(NATIVE_APP);
    }

    ({platformName, statBarHeight} = await this.driver.sessionCapabilities());

    try {
      windowSize = await this.driver.getWindowSize();
    } catch (e) {
      if (e.status === 6) {
        throw e;
      }
      windowSizeError = e;
    }

    try {
      contexts = await this._getContexts(platformName);
    } catch (e) {
      if (e.status === 6) {
        throw e;
      }
      contextsError = e;
    }

    if (currentContext !== NATIVE_APP) {
      await this.driver.context(currentContext);
    }
    // End of note

    /**
     * If its a webview then update the HTML with the element location
     * so the source can be used in the native inspector
     */
    try {
      if (currentContext !== NATIVE_APP) {
        const webviewStatusAddressBarHeight = await this.driver.execute(getWebviewStatusAddressBarHeight, [{platformName, statBarHeight}]);

        await this.driver.execute(setHtmlElementAttributes, [{platformName, webviewStatusAddressBarHeight}]);
      }
    } catch (ign) {}

    try {
      source = parseSource(await this.driver.source());
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

    return {contexts, contextsError, currentContext, currentContextError,
            source, sourceError, screenshot, screenshotError, windowSize, windowSizeError};
  }

  /**
   * Retrieve available contexts, along with the title associated with each webview
   */
  async _getContexts (platform) {
    return platform.toLowerCase() === 'ios' ? await this.driver.execute('mobile:getContexts', []) : await this._getAndroidContexts();
  }

  /**
   * Custom implementation of the `mobile:getContexts` for Android, which only returns an object with the id and title
   */
  async _getAndroidContexts () {
    let newContexts = [];
    const currentContext = await this.driver.currentContext();

    // Get the contexts and retrieve extra data
    const contexts = await this.driver.contexts();
    const getContextData = async (context) => {
      let title;
      const id = context;
      if (id !== NATIVE_APP) {
        await this.driver.context(context);
        const pageTitle = await this.driver.title();
        title = _.isEmpty(pageTitle) ? 'No page title available' : pageTitle;
      }
      return {
        id,
        ...(title ? {title} : {}),
      };
    };
    // const newContexts = await Promise.all(contexts.map((context) => getContextData(context)));
    for (const context of contexts) {
      newContexts.push(await getContextData(context));
    }

    // Set it back to the current context
    await this.driver.context(currentContext);

    return newContexts;
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
    log.error(`Could not find session with window id '${winId}'. Available sessions are: '${JSON.stringify(_.keys(appiumHandlers))}'`);
    return false;
  }
}


AppiumMethodHandler.appiumHandlers = {};
