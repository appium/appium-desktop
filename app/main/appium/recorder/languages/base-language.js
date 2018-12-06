export default class BaseLanguage {

  constructor (statement) {
    this.statement = statement;
  }

  invoke () {
    return this[this.statement.method]();
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
const commands = [
  'click',
];

for (let command of commands) {
  BaseLanguage[command] = () => `//No conversion for ${command}`;
}