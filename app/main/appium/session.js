const webdriverio = require("webdriverio");
const { getSelector } = require("./utils");

export default class Session {

  constructor (args) {
    this.args = args;
    this.elementCache = new Map();
    this.elementIdCounter = 1;
  }

  async init () {
    this.client = webdriverio.remote(this.args);
    await this.client.init();
  }

  async end () {
    await this.client.end();
  }

  async fetchElement (strategy, selector) {
    const wdioSelector = getSelector(strategy, selector);
    const element = await this.client.element(wdioSelector);
    return {
      element,
    };
  }

  async fetchElements (strategy, selector) {

  }

  async executeElementCommand (elementId, methodName, args = [], skipScreenshotAndSource = false) {
    // Execute the method and then log what was executed
    return await this._execute({elementId, methodName, args, skipScreenshotAndSource});
  }

  async executeMethod (methodName, args = [], skipScreenshotAndSource = false) {
    return await this._execute({methodName, args, skipScreenshotAndSource});
  }

  async _execute ({elementId, methodName, args, skipScreenshotAndSource}) {
    // Execute the method
  }

  async _getSourceAndScreenshot () {

  }

}