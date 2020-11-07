import _ from 'lodash';
import Bluebird from 'bluebird';
import { getWebviewStatusAddressBarHeight, parseSource, setHtmlElementAttributes } from './webview-helpers';
import { SCREENSHOT_INTERACTION_MODE, APP_MODE } from '../components/Inspector/shared';

const NATIVE_APP = 'NATIVE_APP';
let _instance = null;

export default class AppiumClient {
  constructor (driver) {
    this.driver = driver;
    this.elementCache = {};
    this.elVarCount = 0;
    this.elArrayVarCount = 0;
  }

  async run (params) {
    const {
      methodName, // Optional. Name of method being provided
      strategy, // Optional. Element locator strategy
      selector, // Optional. Element fetch selector
      fetchArray = false, // Optional. Are we fetching an array of elements or just one?
      elementId, // Optional. Element being operated on
      args = [], // Optional. Arguments passed to method
      skipRefresh = false, // Optional. Do we want the updated source and screenshot?
      appMode = APP_MODE.NATIVE_APP, // Optional. Whether we're in a native or hybrid mode
    } = params;

    if (methodName === 'quit') {
      try {
        await this.driver.quit();
      } catch (ign) {}

      _instance = null;

      // when we've quit the session, there's no source/screenshot to send
      // back
      return {
        source: null,
        screenshot: null,
        windowSize: null,
        result: null
      };
    }

    let res = {};
    if (methodName) {
      if (elementId) {
        console.log(`Handling client method request with method '${methodName}', args ${JSON.stringify(args)} and elementId ${elementId}`); // eslint-disable-line no-console
        res = await this.executeMethod({elementId, methodName, args, skipRefresh, appMode});
      } else {
        console.log(`Handling client method request with method '${methodName}' and args ${JSON.stringify(args)}`); // eslint-disable-line no-console
        res = await this.executeMethod({methodName, args, skipRefresh, appMode});
      }
    } else if (strategy && selector) {
      if (fetchArray) {
        console.log(`Fetching elements with selector '${selector}' and strategy ${strategy}`); // eslint-disable-line no-console
        res = await this.fetchElements({strategy, selector});
      } else {
        console.log(`Fetching an element with selector '${selector}' and strategy ${strategy}`); // eslint-disable-line no-console
        res = await this.fetchElement({strategy, selector});
      }
    }

    return res;
  }

  async executeMethod ({elementId, methodName, args, skipRefresh, appMode}) {
    let cachedEl;
    let res = {};
    if (!_.isArray(args) && !_.isUndefined(args)) {
      args = [args];
    }

    if (elementId) {
      // Give the cached element a variable name (el1, el2, el3,...) the first time it's used
      cachedEl = this.elementCache[elementId];

      if (!cachedEl.variableName) {
        // now that we are actually going to use this element, let's assign it a variable name
        // if it doesn't already have one
        this.elVarCount += 1;
        cachedEl.variableName = `el${this.elVarCount}`;
      }

      // and then execute whatever method we requested on the actual element
      res = await cachedEl.el[methodName].apply(cachedEl.el, args);
    } else {
      // Specially handle the tap and swipe method
      if (methodName === SCREENSHOT_INTERACTION_MODE.TAP) {
        const [x, y] = args;
        res = await this.driver.performActions([{
          type: 'pointer',
          id: 'finger1',
          parameters: {pointerType: 'touch'},
          actions: [
            {type: 'pointerMove', duration: 0, x, y},
            {type: 'pointerDown', button: 0},
            {type: 'pause', duration: 500},
            {type: 'pointerUp', button: 0}
          ]
        }]);
      } else if (methodName === SCREENSHOT_INTERACTION_MODE.SWIPE) {
        const [startX, startY, endX, endY] = args;
        res = await this.driver.performActions([{
          type: 'pointer',
          id: 'finger1',
          parameters: {pointerType: 'touch'},
          actions: [
            {type: 'pointerMove', duration: 0, x: startX, y: startY},
            {type: 'pointerDown', button: 0},
            {type: 'pointerMove', duration: 750, origin: 'viewport', x: endX, y: endY},
            {type: 'pointerUp', button: 0}
          ]
        }]);
      } else if (methodName !== 'getPageSource' && methodName !== 'takeScreenshot') {
        res = await this.driver[methodName].apply(this.driver, args);
      }
    }

    // Give the source/screenshot time to change before taking the screenshot
    await Bluebird.delay(500);

    let contextUpdate = {}, sourceUpdate = {}, screenshotUpdate = {}, windowSizeUpdate = {};
    if (!skipRefresh) {
      sourceUpdate = await this.getSourceUpdate();
      screenshotUpdate = await this.getScreenshotUpdate();
      windowSizeUpdate = await this.getWindowUpdate();

      // only do context updates if user has selected web/hybrid mode (takes forever)
      if (appMode === APP_MODE.WEB_HYBRID) {
        contextUpdate = await this.getContextUpdate();
      }
    }
    return {
      ...cachedEl,
      ...contextUpdate,
      ...sourceUpdate,
      ...screenshotUpdate,
      ...windowSizeUpdate,
      commandRes: res,
    };
  }

  async fetchElements ({strategy, selector}) {
    const els = await this.driver.findElements(strategy, selector);

    this.elArrayVarCount += 1;
    const variableName = `els${this.elArrayVarCount}`;
    const variableType = 'array';

    const elements = {};
    // Cache the elements that we find
    const elementList = els.map((el, index) => {
      const res = {
        el,
        variableName,
        variableIndex: index,
        variableType: 'string',
        id: el.elementId,
        strategy,
        selector,
      };
      elements[el.elementId] = res;
      return res;
    });

    this.elementCache = {...this.elementCache, ...elements};

    return {variableName, variableType, strategy, selector, elements: elementList};
  }

  async fetchElement ({strategy, selector}) {
    const start = Date.now();
    let element = null;
    try {
      element = await this.driver.findElement(strategy, selector);
    } catch (err) {
      return {};
    }

    const executionTime = Date.now() - start;

    const id = element.elementId;

    // Cache this ID along with its variable name, variable type and strategy/selector
    const elementData = {
      el: element,
      variableType: 'string',
      strategy,
      selector,
      id,
    };

    this.elementCache[id] = elementData;

    return {
      ...elementData,
      executionTime,
    };
  }

  async getWindowUpdate () {
    let windowSize, windowSizeError;
    try {
      windowSize = await this.driver.getWindowRect();
    } catch (e) {
      windowSizeError = e;
    }

    return {windowSize, windowSizeError};
  }

  async getContextUpdate () {
    let contexts, contextsError, currentContext, currentContextError, platformName, statBarHeight;

    if (!await this.hasContextsCommand()) {
      return {currentContext: null, contexts: []};
    }

    try {
      currentContext = await this.driver.getContext();
    } catch (e) {
      currentContextError = e;
    }

    // Note: These methods need to be executed in the native context because ChromeDriver behaves differently
    if (currentContext !== NATIVE_APP) {
      await this.driver.switchContext(NATIVE_APP);
    }

    ({platformName, statBarHeight} = await this.driver.getSession());

    try {
      contexts = await this.driver.executeScript('mobile:getContexts', []);
    } catch (e) {
      contextsError = e;
    }

    if (currentContext !== NATIVE_APP) {
      await this.driver.switchContext(currentContext);
    }

    /**
     * If its a webview then update the HTML with the element location
     * so the source can be used in the native inspector
     */
    try {
      if (currentContext !== NATIVE_APP) {
        const webviewStatusAddressBarHeight = await this.driver.executeScript(getWebviewStatusAddressBarHeight,
          [{platformName, statBarHeight}]);
        await this.driver.executeScript(setHtmlElementAttributes, [{
          platformName,
          webviewStatusAddressBarHeight
        }]);
      }
    } catch (ign) {}

    return {contexts, contextsError, currentContext, currentContextError};
  }

  async getSourceUpdate () {
    try {
      const source = parseSource(await this.driver.getPageSource());
      return {source};
    } catch (err) {
      return {sourceError: err};
    }
  }

  async getScreenshotUpdate () {
    try {
      const screenshot = await this.driver.takeScreenshot();
      return {screenshot};
    } catch (err) {
      return {screenshotError: err};
    }
  }

  /**
   * If the app under test can return contexts command.
   *
   * @returns {boolean} True if the app under test supports contexts command.
   *
   */
  async hasContextsCommand () {
    try {
      await this.driver.getContexts();
      return true;
    } catch (ign) { }

    // If the app under test returns non JSON format response
    return false;
  }
}

AppiumClient.instance = (driver) => {
  if (_instance === null) {
    _instance = new AppiumClient(driver);
  }
  return _instance;
};
