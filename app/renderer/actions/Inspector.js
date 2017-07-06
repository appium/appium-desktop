import { ipcRenderer } from 'electron';
import { notification } from 'antd';
import { push } from 'react-router-redux';
import { showError } from './Session';
import { callClientMethod } from './shared';
import { getOptimalXPath } from '../util';
import frameworks from '../lib/client-frameworks';
import settings from '../../settings';

export const SET_SESSION_DETAILS = 'SET_SESSION_DETAILS';
export const SET_SOURCE_AND_SCREENSHOT = 'SET_SOURCE_AND_SCREENSHOT';
export const SESSION_DONE = 'SESSION_DONE';
export const SELECT_ELEMENT = 'SELECT_ELEMENT';
export const UNSELECT_ELEMENT = 'UNSELECT_ELEMENT';
export const SET_SELECTED_ELEMENT_ID = 'SET_SELECTED_ELEMENT_ID';
export const METHOD_CALL_REQUESTED = 'METHOD_CALL_REQUESTED';
export const METHOD_CALL_DONE = 'METHOD_CALL_DONE';
export const SET_FIELD_VALUE = 'SET_FIELD_VALUE';
export const SET_EXPANDED_PATHS = 'SET_EXPANDED_PATHS';
export const SELECT_HOVERED_ELEMENT = 'SELECT_HOVERED_ELEMENT';
export const UNSELECT_HOVERED_ELEMENT = 'UNSELECT_HOVERED_ELEMENT';
export const SHOW_SEND_KEYS_MODAL = 'SHOW_SEND_KEYS_MODAL';
export const HIDE_SEND_KEYS_MODAL = 'HIDE_SEND_KEYS_MODAL';
export const QUIT_SESSION_REQUESTED = 'QUIT_SESSION_REQUESTED';
export const QUIT_SESSION_DONE = 'QUIT_SESSION_DONE';

export const START_RECORDING = 'START_RECORDING';
export const PAUSE_RECORDING = 'PAUSE_RECORDING';
export const CLEAR_RECORDING = 'CLEAR_RECORDING';
export const CLOSE_RECORDER = 'CLOSE_RECORDER';
export const SET_ACTION_FRAMEWORK = 'SET_ACTION_FRAMEWORK';
export const SAVED_FRAMEWORK = 'SAVED_FRAMEWORK';
export const RECORD_ACTION = 'RECORD_ACTION';
export const SET_SHOW_BOILERPLATE = 'SET_SHOW_BOILERPLATE';

export const SHOW_LOCATOR_TEST_MODAL = 'SHOW_LOCATOR_TEST_MODAL';
export const HIDE_LOCATOR_TEST_MODAL = 'HIDE_LOCATOR_TEST_MODAL';
export const SET_LOCATOR_TEST_STRATEGY = 'SET_LOCATOR_TEST_STRATEGY';
export const SET_LOCATOR_TEST_VALUE = 'SET_LOCATOR_TEST_VALUE';
export const SEARCHING_FOR_ELEMENTS = 'SEARCHING_FOR_ELEMENTS';
export const SEARCHING_FOR_ELEMENTS_COMPLETED = 'SEARCHING_FOR_ELEMENTS_COMPLETED';
export const SET_LOCATOR_TEST_ELEMENT = 'SET_LOCATOR_TEST_ELEMENT';
export const CLEAR_SEARCH_RESULTS = 'CLEAR_SEARCH_RESULTS';

// Attributes on nodes that we know are unique to the node
const uniqueAttributes = [
  'name',
  'content-desc',
  'id',
  'accessibility-id',
];

/**
 * Translates sourceXML to JSON
 */
function xmlToJSON (source) {
  let xmlDoc;
  let recursive = (xmlNode, parentPath, index) => {

    // Translate attributes array to an object
    let attrObject = {};
    for (let attribute of xmlNode.attributes || []) {
      attrObject[attribute.name] = attribute.value;
    }

    // Dot Separated path of indices
    let path = (index !== undefined) && `${!parentPath ? '' : parentPath + '.'}${index}`;

    return {
      children: [...xmlNode.children].map((childNode, childIndex) => recursive(childNode, path, childIndex)),
      tagName: xmlNode.tagName,
      attributes: attrObject,
      xpath: getOptimalXPath(xmlDoc, xmlNode, uniqueAttributes),
      path,
    };
  };

  xmlDoc = (new DOMParser()).parseFromString(source, 'text/xml');
  let sourceXML = xmlDoc.children[0];
  return recursive(sourceXML);
}


export function bindAppium () {
  return (dispatch) => {
    ipcRenderer.on('appium-session-done', () => {
      notification.error({
        message: "Error",
        description: "Session has been terminated",
        duration: 0
      });
      ipcRenderer.removeAllListeners('appium-client-command-response');
      ipcRenderer.removeAllListeners('appium-client-command-response-error');
      dispatch({type: SESSION_DONE});
    });
  };
}


export function selectElement (path) {
  return async (dispatch, getState) => {
    dispatch({type: SELECT_ELEMENT, path});
    const selectedElement = getState().inspector.selectedElement;

    // Expand all of this element's ancestors so that it's visible in the tree
    let {expandedPaths} = getState().inspector;
    let pathArr = path.split('.').slice(0, path.length - 1);
    while (pathArr.length > 1) {
      pathArr.splice(pathArr.length - 1);
      let path = pathArr.join('.');
      if (expandedPaths.indexOf(path) < 0) {
        expandedPaths.push(path);
      }
    }
    dispatch({type: SET_EXPANDED_PATHS, paths: expandedPaths});

    // Get the information about the element
    const {elementId, variableName, variableType} = await callClientMethod({
      strategy: 'xpath', // TODO: Get the optimal strategy + selector
      selector: selectedElement.xpath,
    });
    dispatch({type: SET_SELECTED_ELEMENT_ID, elementId, variableName, variableType});
    
  };
}

export function unselectElement () {
  return (dispatch) => {
    dispatch({type: UNSELECT_ELEMENT});
  };
}

export function selectHoveredElement (path) {
  return (dispatch) => {
    dispatch({type: SELECT_HOVERED_ELEMENT, path});
  };
}

export function unselectHoveredElement (path) {
  return (dispatch) => {
    dispatch({type: UNSELECT_HOVERED_ELEMENT, path});
  };
}

/**
 * Requests a method call on appium
 */
export function applyClientMethod (params) {
  return async (dispatch, getState) => {
    let isRecording = params.methodName !== 'quit' &&
                      params.methodName !== 'source' &&
                      getState().inspector.isRecording;
    try {
      dispatch({type: METHOD_CALL_REQUESTED});
      let {source, screenshot, result, sourceError, screenshotError} = await callClientMethod(params);
      if (isRecording) {
        // for now just add a fake recorded step of 'finding'
        // the element we are going to interact with. in the
        // future we'll want to adjust this to use the locator
        // strategy we recommend to the user, not just xpath
        if (params.xpath) {
          // also make sure we only do this optionally in case we're calling
          // a global driver method that isn't operating on an element
          recordAction('findElement', ['xpath', params.xpath])(dispatch);
        }
        // now record the actual action
        let args = params.args || [];
        recordAction(params.methodName, args)(dispatch);
      }
      dispatch({type: METHOD_CALL_DONE});
      dispatch({type: SET_SOURCE_AND_SCREENSHOT, source: source && xmlToJSON(source), screenshot, sourceError, screenshotError});
      return result;
    } catch (error) {
      let methodName = params.methodName === 'click' ? 'tap' : params.methodName;
      showError(error, methodName, 10);
      dispatch({type: METHOD_CALL_DONE});
    }
  };
}

export function showSendKeysModal () {
  return (dispatch) => {
    dispatch({type: SHOW_SEND_KEYS_MODAL});
  };
}

export function hideSendKeysModal () {
  return (dispatch) => {
    dispatch({type: HIDE_SEND_KEYS_MODAL});
  };
}

/**
 * Set a value of an arbitrarily named field
 */
export function setFieldValue (name, value) {
  return (dispatch) => {
    dispatch({type: SET_FIELD_VALUE, name, value});
  };
}

export function setExpandedPaths (paths) {
  return (dispatch) => {
    dispatch({type: SET_EXPANDED_PATHS, paths});
  };
}

/**
 * Quit the session and go back to the new session window
 */
export function quitSession () {
  return async (dispatch) => {
    dispatch({type: QUIT_SESSION_REQUESTED});
    await applyClientMethod({methodName: 'quit'})(dispatch);
    dispatch({type: QUIT_SESSION_DONE});
    dispatch(push('/session'));
  };
}

export function startRecording () {
  return (dispatch) => {
    dispatch({type: START_RECORDING});
  };
}

export function pauseRecording () {
  return (dispatch) => {
    dispatch({type: PAUSE_RECORDING});
  };
}

export function clearRecording () {
  return (dispatch) => {
    dispatch({type: CLEAR_RECORDING});
  };
}

export function getSavedActionFramework () {
  return async (dispatch) => {
    let framework = await settings.get(SAVED_FRAMEWORK);
    dispatch({type: SET_ACTION_FRAMEWORK, framework});
  };
}

export function setActionFramework (framework) {
  return async (dispatch) => {
    if (!frameworks[framework]) {
      throw new Error(`Framework '${framework}' not supported`);
    }
    await settings.set(SAVED_FRAMEWORK, framework);
    dispatch({type: SET_ACTION_FRAMEWORK, framework});
  };
}

export function recordAction (action, params) {
  return (dispatch) => {
    dispatch({type: RECORD_ACTION, action, params});
  };
}

export function closeRecorder () {
  return (dispatch) => {
    dispatch({type: CLOSE_RECORDER});
  };
}

export function toggleShowBoilerplate () {
  return (dispatch, getState) => {
    const show = !getState().inspector.showBoilerplate;
    dispatch({type: SET_SHOW_BOILERPLATE, show});
  };
}

export function setSessionDetails (sessionDetails) {
  return (dispatch) => {
    dispatch({type: SET_SESSION_DETAILS, sessionDetails});
  };
}

export function showLocatorTestModal () {
  return (dispatch) => {
    dispatch({type: SHOW_LOCATOR_TEST_MODAL});
  };
}

export function hideLocatorTestModal () {
  return (dispatch) => {
    dispatch({type: HIDE_LOCATOR_TEST_MODAL});
  };
}

export function setLocatorTestValue (locatorTestValue) {
  return (dispatch) => {
    dispatch({type: SET_LOCATOR_TEST_VALUE, locatorTestValue});
  };
}

export function setLocatorTestStrategy (locatorTestStrategy) {
  return (dispatch) => {
    dispatch({type: SET_LOCATOR_TEST_STRATEGY, locatorTestStrategy});
  };
}

export function searchForElement (strategy, selector) {
  return async (dispatch) => {
    dispatch({type: SEARCHING_FOR_ELEMENTS});
    let {elements} = await callClientMethod({strategy, selector, fetchArray: true});
    elements = elements.map((el) => el.id);
    dispatch({type: SEARCHING_FOR_ELEMENTS_COMPLETED, elements});
  };
}

export function setLocatorTestElement (elementId) {
  return (dispatch) => {
    dispatch({type: SET_LOCATOR_TEST_ELEMENT, elementId});
  };
}

export function clearSearchResults () {
  return (dispatch) => {
    dispatch({type: CLEAR_SEARCH_RESULTS});
  };
}