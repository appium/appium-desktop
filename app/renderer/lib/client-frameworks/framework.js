export default class Framework {

  constructor (host = "localhost", port = 4723, caps = {}) {
    this.host = host;
    this.port = port;
    this.caps = caps;
    this.actions = [];
    this.localVarCount = 0;
    this.localVarCache = {};
    this.lastAssignedVar = null;
  }

  get name () {
    throw new Error("Must implement name getter");
  }

  get language () {
    throw new Error("Must implement language getter");
  }

  addAction (action, params) {
    this.actions.push({action, params});
  }

  wrapWithBoilerplate () {
    throw new Error("Must implement wrapWithBoilerplate");
  }

  indent (str, spaces) {
    let lines = str.split("\n");
    let spaceStr = "";
    for (let i = 0; i < spaces; i++) {
      spaceStr += " ";
    }
    return lines
      .filter((l) => !!l.trim())
      .map((l) => `${spaceStr}${l}`)
      .join("\n");
  }

  getCodeString (includeBoilerplate = false) {
    let str = "";
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

  codeFor_findAndAssign () {
    throw new Error("Need to implement codeFor_findAndAssign");
  }

  codeFor_findElement (strategy, locator) {
    let [localVar, wasNew] = this.getVarForFind(strategy, locator);
    if (!wasNew) {
      // if we've already found this element, don't print out
      // finding it again
      return "";
    }

    return this.codeFor_findAndAssign(strategy, locator, localVar);

  }

  codeFor_clickElement () {
    return '';
  }
}
