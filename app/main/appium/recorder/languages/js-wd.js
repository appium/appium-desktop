import BaseLanguage from './base-language';

export default class JSWD extends BaseLanguage {

  constructor (...args) {
    super(...args);
  }

  click () {
    return `await ${this.getElVarName()}.click();`;
  }

  findElement () {
    return `let ${this.varName} = await driver.elementById('some-unique-id');`;
  }

  findElements () {
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