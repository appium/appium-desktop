import JSWD from './languages/js-wd';
import JSWDIO from './languages/js-wdio';
import Ruby from './languages/ruby';
import Java from './languages/java';
import Python from './languages/python';

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
   * Convert this statement to a language statement
   * @param {String} language Can be one of the 'RecordingLanguages'
   */
  toLanguage (language) {
    const {JS_WD, JS_WDIO, PYTHON, RUBY, JAVA} = RecordingLanguages;
    switch (language) {
      case JS_WD:
        return (new JSWD(this)).invoke();
      case JS_WDIO:
        return (new JSWDIO(this)).invoke();
      case JAVA:
        return (new Java(this)).invoke();
      case RUBY:
        return (new Ruby(this)).invoke();
      case PYTHON:
        return (new Python(this)).invoke();
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