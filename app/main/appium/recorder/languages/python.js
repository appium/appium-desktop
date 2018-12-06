import BaseLanguage from './base-language';

let suffixMap = {
  xpath: "xpath",
  'accessibility id': 'accessibility_id',
  'id': 'id',
  'name': 'name', // TODO: How does Python use name selector
  'class name': 'class_name',
  '-android uiautomator': 'AndroidUIAutomator',
  '-ios predicate string': 'ios_predicate',
  '-ios class chain': 'ios_uiautomation', // TODO: Could not find iOS UIAutomation
};

export default class Python extends BaseLanguage {

  constructor (...args) {
    super(...args);
  }

  click () {
    return `${this.getElVarName()}.click()`;
  }

  findElement () {
    return `${this.varName} = driver.find_element_by_${suffixMap[this.args[0]]}(${JSON.stringify(this.args[1])})`;
  }

  findElements () {
    return `${this.varName} = driver.find_elements_by_${suffixMap[this.args[1]]}(${JSON.stringify(this.args[0])})`;
  }
}