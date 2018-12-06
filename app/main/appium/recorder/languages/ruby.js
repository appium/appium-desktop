import BaseLanguage from './base-language';
import commands from './commands-enum';

let suffixMap = {
  xpath: ":xpath",
  'accessibility id': ':accessibility_id',
  'id': ':id',
  'name': ':name',
  'class name': ':class_name',
  '-android uiautomator': ':uiautomation',
  '-ios predicate string': ':predicate',
  '-ios class chain': ':class_chain',
};

export default class Ruby extends BaseLanguage {

  constructor (...args) {
    super(...args);
  }

  ['click'] () {
    return `${this.getElVarName()}.click`;
  }

  [commands.FIND_ELEMENT] () {
    return `${this.varName} = driver.find_element(${suffixMap[this.args[0]]}, ${JSON.stringify(this.args[1])})`;
  }

  [commands.FIND_ELEMENTS] () {
    return `${this.varName} = driver.find_elements(${suffixMap[this.args[0]]}, ${JSON.stringify(this.args[1])})`;
  }

}