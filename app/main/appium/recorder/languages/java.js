import BaseLanguage from './base-language';
import commands from './commands-enum';

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

  [commands.CLICK] () {
    return `${this.getElVarName()}.click();`;
  }

  [commands.FIND_ELEMENT] () {
    return `MobileElement ${this.varName} = (MobileElement) driver.findElementBy${suffixMap[this.args[0]]}(${JSON.stringify(this.args[1])});`;
  }

  [commands.FIND_ELEMENTS] () {
    return `List<MobileElement> ${this.varName} = (MobileElement) driver.findElementsBy${suffixMap[this.args[0]]}(${JSON.stringify(this.args[1])});`;
  }
}