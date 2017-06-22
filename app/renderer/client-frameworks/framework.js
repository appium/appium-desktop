export default class Framework {

  constructor (host, port, caps) {
    if (!host || !port || !caps) {
      throw new Error("Must initialize with host, port, caps");
    }
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

  addAction (action, params) {
    this.actions.push({action, params});
  }

  get boilerplate () {
    throw new Error("Must implement boilerplate getter");
  }

  getCodeString (includeBoilerplate = false) {
    let str = "";
    if (includeBoilerplate) {
      str += this.boilerplate;
    }
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
}
