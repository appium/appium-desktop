import { RecordingLanguages } from '../../../../../app/main/appium/recorder/statement';
import { COMMANDS } from '../../../../../app/main/appium/recorder/languages/base-language';

const { JS_WD, JS_WDIO, PYTHON, RUBY, JAVA, ROBOT } = RecordingLanguages;

export const ElemTestCases = [

  ['elem', COMMANDS.CLICK, {
    [JS_WD]: 'await elem.click();',
    [JS_WDIO]: 'elem.click();',
    [JAVA]: 'elem.click();',
    [PYTHON]: 'elem.click()',
    [RUBY]: 'elem.click',
    // 'robot': '', // TODO: Robot will need to be specially handled
  }],

];

export const ElemFindTestCases = [
  [COMMANDS.FIND_ELEMENT, 'el', ['id', 'some-unique-id'], {
    [JS_WD]: "let el = await driver.elementById('some-unique-id');",
    [JS_WDIO]: 'let el = driver.element("#some-unique-id");',
    [JAVA]: 'MobileElement el = (MobileElement) driver.findElementById("some-unique-id");',
    [PYTHON]: 'el = driver.find_element_by_id("some-unique-id")',
    [RUBY]: 'el = driver.find_element(:id, "some-unique-id")',
  }],
];