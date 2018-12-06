import _ from 'lodash';

export default class BaseLanguage {

  constructor (statement) {
    this.statement = statement;
    this.varName = statement.varName;
    this.method = statement.method;
    this.elVarName = statement.elVarName;
    this.elArrayVarIndex = statement.elArrayVarIndex;
    this.args = statement.args;

  }

  invoke () {
    return this[this.method]();
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

// List of available methods
export const COMMANDS = {
  CLICK: 'click',
  FIND_ELEMENT: 'findElement',
  FIND_ELEMENTS: 'findElements',
};

for (let [, command] of _.toPairs(COMMANDS)) {
  BaseLanguage[command] = () => `//No conversion for ${command}`;
}