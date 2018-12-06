import BaseLanguage from './base-language';

export default class JSWDIO extends BaseLanguage {

  constructor (...args) {
    super(...args);
  }

  click () {
    return `${this.getElVarName()}.click();`;
  }
}