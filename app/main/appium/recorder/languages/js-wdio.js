import BaseLanguage from './base-language';

export default class JSWDIO extends BaseLanguage {

  constructor (...args) {
    super(...args);
  }

  click () {
    return `${this.getElVarName()}.click();`;
  }

  findElement () {
    return `let ${this.varName} = driver.element(${JSON.stringify(this._getSelector())});`;
  }

  findElements () {
    return `let ${this.varName} = driver.elements(${JSON.stringify(this._getSelector())});`;
  }

  _getSelector () {
    // wdio has its own way of indicating the strategy in the locator string
    let [strategy, selector] = this.args;
    let locator;
    switch (strategy) {
      case "xpath": break; // xpath does not need to be updated
      case "accessibility id": locator = `~${selector}`; break;
      case "id": locator = `#${selector}`; break;
      case "name": locator = `name=${selector}`; break;
      case "class name": locator = `${selector}`; break;
      case "-android uiautomator": locator = `android=${selector}`; break;
      case "-ios predicate string": locator = `ios=${selector}`; break;
      case "-ios class chain": locator = `ios=${selector}`; break; // TODO: Handle IOS class chain properly. Not all libs support it. Or take it out
      default: throw new Error(`Can't handle strategy ${strategy}`);
    }
    return locator;
  }
}