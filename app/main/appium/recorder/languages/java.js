import BaseLanguage from './base-language';

export default class Java extends BaseLanguage {

  constructor (...args) {
    super(...args);
  }

  click () {
    return `${this.getElVarName()}.click();`;
  }
}