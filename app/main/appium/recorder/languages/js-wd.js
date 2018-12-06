import BaseLanguage from './base-language';
import commands from './commands-enum';

export default class JSWD extends BaseLanguage {

  constructor (...args) {
    super(...args);
  }

  click () {
    return `await ${this.getElVarName()}.click();`;
  }

  [commands.FIND_ELEMENT] () {
    return `let ${this.varName} = await driver.elementById('some-unique-id');`;
  }

  [commands.FIND_ELEMENTS] () {
    return `let ${this.varName} = await driver.elementsById('some-unique-id');`;
  }

  getElVarName () {
    const {elVarName, elArrayVarName, elArrayVarIndex} = this.statement;
    if (elVarName) {
      return elVarName;
    } else if (elArrayVarName) {
      return `${elArrayVarName}[${elArrayVarIndex}]`;
    }
  }
}