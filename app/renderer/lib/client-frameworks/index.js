import JsWdFramework from './js-wd';
import JsWdIoFramework from './js-wdio';
import JavaFramework from './java';
import PythonFramework from './python';

const frameworks = {
  jsWd: JsWdFramework,
  jsWdIo: JsWdIoFramework,
  java: JavaFramework,
  python: PythonFramework,
};

export default frameworks;
