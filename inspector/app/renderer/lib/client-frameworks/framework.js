export default class Framework {

  constructor (host, port, path, https, caps) {
    this.host = host || 'localhost';
    this.port = port || 4723;
    this.path = path || '/wd/hub';
    this.caps = caps || {};
    this.https = !!https;
    this.scheme = https ? 'https' : 'http';
    this.actions = [];
    this.localVarCount = 0;
    this.localVarCache = {};
    this.lastAssignedVar = null;
  }

  get serverUrl () {
    return `${this.scheme}://${this.host}:${this.port}${this.path}`;
  }

  get name () {
    throw new Error('Must implement name getter');
  }

  get language () {
    throw new Error('Must implement language getter');
  }

  addAction (action, params) {
    this.actions.push({action, params});
  }

  wrapWithBoilerplate () {
    throw new Error('Must implement wrapWithBoilerplate');
  }

  indent (str, spaces) {
    let lines = str.split('\n');
    let spaceStr = '';
    for (let i = 0; i < spaces; i++) {
      spaceStr += ' ';
    }
    return lines
      .filter((l) => !!l.trim())
      .map((l) => `${spaceStr}${l}`)
      .join('\n');
  }

  getCodeString (includeBoilerplate = false) {
    let str = '';
    for (let {action, params} of this.actions) {
      let genCodeFn = `codeFor_${action}`;
      if (!this[genCodeFn]) {
        throw new Error(`Need to implement 'codeFor_${action}()'`);
      }
      let code = this[genCodeFn](...params);
      if (code) {
        str += `${code}\n`;
      }
    }
    if (includeBoilerplate) {
      return this.wrapWithBoilerplate(str);
    }
    return str;
  }

  getNewLocalVar () {
    this.localVarCount++;
    return `el${this.localVarCount}`;
  }

  getVarForFind (strategy, locator) {
    const key = `${strategy}-${locator}`;
    let wasNew = false;
    if (!this.localVarCache[key]) {
      this.localVarCache[key] = this.getNewLocalVar();
      wasNew = true;
    }
    this.lastAssignedVar = this.localVarCache[key];
    return [this.localVarCache[key], wasNew];
  }

  getVarName (varName, varIndex) {
    if (varIndex || varIndex === 0) {
      return `${varName}[${varIndex}]`;
    }
    return varName;
  }

  codeFor_findAndAssign () {
    throw new Error('Need to implement codeFor_findAndAssign');
  }

  codeFor_findElement (strategy, locator) {
    let [localVar, wasNew] = this.getVarForFind(strategy, locator);
    if (!wasNew) {
      // if we've already found this element, don't print out
      // finding it again
      return '';
    }

    return this.codeFor_findAndAssign(strategy, locator, localVar);

  }

  codeFor_tap () {
    throw new Error('Need to implement codeFor_tap');
  }

  codeFor_swipe () {
    throw new Error('Need to implement codeFor_tap');
  }
}
