import { RecordingLanguages } from '../../../../../app/main/appium/recorder/statement';
import commands from '../../../../../app/main/appium/recorder/languages/commands-enum';

const { JS_WD, JS_WDIO, PYTHON, RUBY, JAVA, ROBOT } = RecordingLanguages;

export const ElemTestCases = [

  ['elem', commands.CLICK, {
    [JS_WD]: 'await elem.click();',
    [JS_WDIO]: 'elem.click();',
    [JAVA]: 'elem.click();',
    [PYTHON]: 'elem.click()',
    [RUBY]: 'elem.click',
    // 'robot': '', // TODO: Robot will need to be specially handled
  }],

];

export const ElemFindTestCases = [
  [commands.FIND_ELEMENT, 'el', ['id', 'some-unique-id'], {
    [JS_WD]: "let el = await driver.elementById('some-unique-id');",
    [JS_WDIO]: 'let el = driver.element("#some-unique-id");',
    [JAVA]: 'MobileElement el = (MobileElement) driver.findElementById("some-unique-id");',
    [PYTHON]: 'el = driver.find_element_by_id("some-unique-id")',
    [RUBY]: 'el = driver.find_element(:id, "some-unique-id")',
  }],
  [commands.FIND_ELEMENTS, 'els', ['id', 'some-unique-id'], {
    [JS_WD]: "let els = await driver.elementsById('some-unique-id');",
    [JS_WDIO]: 'let els = driver.elements("#some-unique-id");',
    [JAVA]: 'List<MobileElement> els = (MobileElement) driver.findElementsById("some-unique-id");',
    [PYTHON]: 'els = driver.find_elements_by_id("some-unique-id")',
    [RUBY]: 'els = driver.find_elements(:id, "some-unique-id")',
  }],
];
