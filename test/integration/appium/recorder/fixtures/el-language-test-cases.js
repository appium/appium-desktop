import { RecordingLanguages } from '../../../../../app/main/appium/recorder/statement';

const { JS_WD, JS_WDIO, PYTHON, RUBY, JAVA, ROBOT } = RecordingLanguages;

export default [

  ['elem', 'click', {
    [JS_WD]: 'await elem.click();',
    [JS_WDIO]: 'elem.click();',
    [JAVA]: 'elem.click();',
    [PYTHON]: 'elem.click()',
    [RUBY]: 'elem.click',
    // 'robot': '', // TODO: Robot will need to be specially handled
  }]

];