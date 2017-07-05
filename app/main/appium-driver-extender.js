import Bluebird from 'bluebird';

// TODO: Rename this to AppiumElementCacher
export default class AppiumDriverExtender {
  constructor (driver) {
    this.elementCache = {};
    this.driver = driver;
    this.elVariableCounter = 1;
    this.elArrayVariableCounter = 1;
  }

  async fetchElement (strategy, selector) {
    let element = await this.driver.elementOrNull(strategy, selector);
    if (element === null) {
      return {};
    }
    let id = element.value;

    // Give the element a name that is used in recorder (el1, el2, el3, ...)
    let variableName = `el${this.elVariableCounter++}`;

    // Cache this ID along with it's variable name and variable type
    let cachedEl = this.elementCache[id] = {
      el: element,
      variableType: 'string',
      variableName,
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
        variableName: `${variableName}[${index}]`,
        variableType: 'string',
        id: el.value,
      };
      this.elementCache[el.value] = res;
      return res;
    });
    
    return {variableName, variableType, strategy, selector, elements};
  }

  async executeElementCommand (elementId, methodName, args) {
    const elCache = this.elementCache[elementId];
    const res = await elCache.el[methodName].apply(args);

    // Give the source/screenshot time to change before taking the screenshot
    await Bluebird.delay(500);

    let sourceAndScreenshot = await this._getSourceAndScreenshot();

    return {
      ...sourceAndScreenshot,
      ...elCache,
      res,
    };
  }

  async executeMethod (methodName, args) {
    let res = {};
    if (methodName !== 'source' && methodName !== 'screenshot') {
      res = await this.driver[methodName].apply(this.driver, args);
    }

    // Give the source/screenshot time to change before taking the screenshot
    await Bluebird.delay(500);

    let sourceAndScreenshot = await this._getSourceAndScreenshot();

    return {
      ...sourceAndScreenshot,
      res,
    };
  }

  async _getSourceAndScreenshot () {
    let source, sourceError, screenshot, screenshotError;
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

    return {source, sourceError, screenshot, screenshotError};
  }

}