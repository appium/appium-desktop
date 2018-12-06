import JSWD from './languages/js-wd';

/**
 * Define an Appium 'Statement' as an object that can then
 * be translated to a statement in a different programming language
 * (js, ruby, python, java, robot)
 */
class Statement {

  constructor (
    varName,
    elVarName,
    elArrayVarName,
    elArrayVarIndex,
    method,
    args,
  ) {
    this.varName = varName || null;
    this.elVarName = elVarName || null;
    this.elArrayVarName = elArrayVarName || null;
    this.elArrayVarIndex = elArrayVarIndex || null;
    this.method = method || null;
    this.args = args || null;
  }

  /**
   * 
   * @param {String} language Can be one of the 'RecordingLanguages'
   */
  toLanguage (language) {
    switch (language) {
      case RecordingLanguages.JS_WD:
        return (new JSWD(this)).invoke();
      default:
        return '';
    }
  }

}

export const RecordingLanguages = {
  JS_WD: 'js_wd',
  JS_WDIO: 'js_wdio',
  RUBY: 'ruby',
  PYTHON: 'python',
  JAVA: 'java',
  ROBOT: 'robot',
};

export class RecordBuilder {

  withVarName (varName) {
    this.varName = varName;
    return this;
  }

  withVarIndex (varIndex) {
    this.varIndex = varIndex;
    return this;
  }

  withElVarName (elVarName) {
    this.elVarName = elVarName;
    return this;
  }

  withElArrayVarName (elArrayVarName) {
    this.elArrayVarName = elArrayVarName;
    return this;
  }

  withElArrayVarIndex (elArrayVarIndex) {
    this.elArrayVarIndex = elArrayVarIndex;
    return this;
  }

  withMethod (method) {
    this.method = method;
    return this;
  }

  withArgs (args) {
    this.args = args;
    return this;
  }

  build () {
    return new Statement(
      this.varName,
      this.elVarName,
      this.elArrayVarName,
      this.elArrayVarIndex,
      this.method,
      this.args,
    );
  }

}