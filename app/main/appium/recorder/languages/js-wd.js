import BaseLanguage from './base-language';

export default class JSWD extends BaseLanguage {

  constructor (...args) {
    super(...args);
  }

  click () {
    return `await ${this.getElVarName()}.click();`;
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