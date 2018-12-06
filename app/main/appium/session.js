const webdriverio = require("webdriverio");

export default class Session {

  constructor (args) {
    this.args = args;
  }

  async init () {
    this.client = webdriverio.remote(this.args);
    await this.client.init();
  }

  async fetchElement (strategy, selector) {

  }

  async fetchElements (strategy, selector) {

  }

  async executeElementCommand (elementId, methodName, args = [], skipScreenshotAndSource = false) {
    return await this._execute({elementId, methodName, args, skipScreenshotAndSource});
  }

  async executeMethod (methodName, args = [], skipScreenshotAndSource = false) {
    return await this._execute({methodName, args, skipScreenshotAndSource});
  }

  async _execute ({elementId, methodName, args, skipScreenshotAndSource}) {

  }

  async _getSourceAndScreenshot () {

  }

}