export default class BaseLanguage {

  constructor (statement) {
    this.statement = statement;
  }

  invoke () {
    return this[this.statement.method]();
  }
}

// List of available methods
const commands = [
  'click',
];

for (let command of commands) {
  BaseLanguage[command] = () => `//No conversion for ${command}`;
}