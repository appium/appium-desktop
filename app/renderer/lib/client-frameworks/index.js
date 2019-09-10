import JsWdFramework from './js-wd';
import JsWdIoFramework from './js-wdio';
import JsOxygenFramework from './js-oxygen';
import JavaFramework from './java';
import PythonFramework from './python';
import RubyFramework from './ruby';
import RobotFramework from './robot';

const frameworks = {
  jsWd: JsWdFramework,
  jsWdIo: JsWdIoFramework,
  jsOxygen: JsOxygenFramework,
  java: JavaFramework,
  python: PythonFramework,
  ruby: RubyFramework,
  robot: RobotFramework,
};

export default frameworks;
