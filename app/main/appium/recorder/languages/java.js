import BaseLanguage from './base-language';

let suffixMap = {
  xpath: "XPath",
  'accessibility id': 'AccessibilityId',
  'id': 'Id',
  'class name': 'ClassName',
  'name': 'Name',
  '-android uiautomator': 'AndroidUIAutomator',
  '-ios predicate string': 'IosNsPredicate',
  '-ios class chain': 'IosClassChain',
};

export default class Java extends BaseLanguage {

  constructor (...args) {
    super(...args);
  }

  click () {
    return `${this.getElVarName()}.click();`;
  }

  findElement () {
    return `MobileElement ${this.varName} = (MobileElement) driver.findElementBy${suffixMap[this.args[0]]}(${JSON.stringify(this.args[1])});`;
  }

  findElements () {
    return `List<MobileElement> ${this.varName} = (MobileElement) driver.findElementsBy${suffixMap[this.args[0]]}("${JSON.stringify(this.args[1])}");`;
  }
}