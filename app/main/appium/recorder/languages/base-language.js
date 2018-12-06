import _ from 'lodash';
import commands from './commands-enum';

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

for (let [, command] of _.toPairs(commands)) {
  BaseLanguage[command] = () => `//No conversion for ${command}`;
}