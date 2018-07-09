import { ipcRenderer } from 'electron';
import { notification } from 'antd';
import { push } from 'react-router-redux';
import _ from 'lodash';
import B from 'bluebird';
import { getLocators } from '../components/Inspector/shared';
import { showError } from './Session';
import { bindClient, unbindClient, callClientMethod } from './shared';
import { getOptimalXPath } from '../util';
import frameworks from '../lib/client-frameworks';
import settings from '../../settings';

export const SET_SESSION_DETAILS = 'SET_SESSION_DETAILS';
export const SET_SOURCE_AND_SCREENSHOT = 'SET_SOURCE_AND_SCREENSHOT';
export const SESSION_DONE = 'SESSION_DONE';
export const SELECT_ELEMENT = 'SELECT_ELEMENT';
export const UNSELECT_ELEMENT = 'UNSELECT_ELEMENT';
export const SET_SELECTED_ELEMENT_ID = 'SET_SELECTED_ELEMENT_ID';
export const SET_INTERACTIONS_NOT_AVAILABLE = 'SET_INTERACTIONS_NOT_AVAILABLE';
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
export const ADD_ASSIGNED_VAR_CACHE = 'ADD_ASSIGNED_VAR_CACHE';
export const CLEAR_ASSIGNED_VAR_CACHE = 'CLEAR_ASSIGNED_VAR_CACHE';
export const SET_SCREENSHOT_INTERACTION_MODE = 'SET_SCREENSHOT_INTERACTION_MODE';
export const SET_SEARCHED_FOR_ELEMENT_BOUNDS = 'SET_SEARCHED_FOR_ELEMENT_BOUNDS';
export const CLEAR_SEARCHED_FOR_ELEMENT_BOUNDS = 'CLEAR_SEARCHED_FOR_ELEMENT_BOUNDS';

export const SET_SWIPE_START = 'SET_SWIPE_START';
export const SET_SWIPE_END = 'SET_SWIPE_END';
export const CLEAR_SWIPE_ACTION = 'CLEAR_SWIPE_ACTION';
export const PROMPT_KEEP_ALIVE = 'PROMPT_KEEP_ALIVE';
export const HIDE_PROMPT_KEEP_ALIVE = 'HIDE_PROMPT_KEEP_ALIVE';


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
    // Listen for session response messages from 'main'
    bindClient();

    // If user is inactive ask if they wish to keep session alive
    ipcRenderer.on('appium-prompt-keep-alive', () => {
      promptKeepAlive()(dispatch);
    });

    // When session is done, unbind them all
    ipcRenderer.on('appium-session-done', (evt, {reason, killedByUser}) => {
      ipcRenderer.removeAllListeners('appium-session-done');
      ipcRenderer.removeAllListeners('appium-prompt-keep-alive');
      unbindClient();
      dispatch({type: QUIT_SESSION_DONE});
      dispatch(push('/session'));
      if (!killedByUser) {
        notification.error({
          message: "Error",
          description: reason || "Session has been terminated",
          duration: 0
        });
      }
    });
  };
}

// A debounced function that calls findElement and gets info about the element
const findElement = _.debounce(async function (strategyMap, dispatch, getState, path) {
  for (let [strategy, selector] of strategyMap) {
    // Get the information about the element
    let {elementId, variableName, variableType} = await callClientMethod({
      strategy,
      selector,
    });

    // Set the elementId, variableName and variableType for the selected element 
    // (check first that the selectedElementPath didn't change, to avoid race conditions)
    if (elementId && getState().inspector.selectedElementPath === path) {
      return dispatch({type: SET_SELECTED_ELEMENT_ID, elementId, variableName, variableType});
    }
  }

  return dispatch({type: SET_INTERACTIONS_NOT_AVAILABLE});
}, 1000);

export function selectElement (path) {
  return async (dispatch, getState) => {
    // Set the selected element in the source tree
    dispatch({type: SELECT_ELEMENT, path});
    const state = getState().inspector;
    const {attributes: selectedElementAttributes, xpath: selectedElementXPath} = state.selectedElement;
    const {sourceXML} = state;

    // Expand all of this element's ancestors so that it's visible in the source tree
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


    // Find the optimal selection strategy. If none found, fall back to XPath.
    const strategyMap = _.toPairs(getLocators(selectedElementAttributes, sourceXML));
    strategyMap.push(['xpath', selectedElementXPath]);

    // Debounce find element so that if another element is selected shortly after, cancel the previous search
    await findElement(strategyMap, dispatch, getState, path);
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
      let {source, screenshot, windowSize, result, sourceError, screenshotError, windowSizeError,
        variableName, variableIndex, strategy, selector} = await callClientMethod(params);
      if (isRecording) {
        // Add 'findAndAssign' line of code. Don't do it for arrays though. Arrays already have 'find' expression
        if (strategy && selector && !variableIndex && variableIndex !== 0) {
          findAndAssign(strategy, selector, variableName, false)(dispatch, getState);
        }

        // now record the actual action
        let args = [variableName, variableIndex];
        args = args.concat(params.args || []);
        dispatch({type: RECORD_ACTION, action: params.methodName, params: args });
      }
      dispatch({type: METHOD_CALL_DONE});
      dispatch({
        type: SET_SOURCE_AND_SCREENSHOT, 
        source: source && xmlToJSON(source), 
        sourceXML: source,
        screenshot,
        windowSize,
        sourceError, 
        screenshotError,
        windowSizeError,
      });
      return result;
    } catch (error) {
      let methodName = params.methodName === 'click' ? 'tap' : params.methodName;
      showError(error, methodName, 10);
      dispatch({type: METHOD_CALL_DONE});
    }
  };
}

export function addAssignedVarCache (varName) {
  return (dispatch) => {
    dispatch({type: ADD_ASSIGNED_VAR_CACHE, varName});
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
    await applyClientMethod({methodName: 'quit'})(dispatch);
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
    ipcRenderer.send('appium-restart-recorder'); // Tell the main thread to start the variable count from 1 
    dispatch({type: CLEAR_ASSIGNED_VAR_CACHE}); // Get rid of the variable cache
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
    dispatch({type: CLEAR_SEARCHED_FOR_ELEMENT_BOUNDS});
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
  return async (dispatch, getState) => {
    dispatch({type: SEARCHING_FOR_ELEMENTS});
    try {
      let {elements, variableName} = await callClientMethod({strategy, selector, fetchArray: true});
      findAndAssign(strategy, selector, variableName, true)(dispatch, getState);
      elements = elements.map((el) => el.id);
      dispatch({type: SEARCHING_FOR_ELEMENTS_COMPLETED, elements});
    } catch (error) {
      dispatch({type: SEARCHING_FOR_ELEMENTS_COMPLETED});
      showError(error, 10);
    }
  };
}

export function findAndAssign (strategy, selector, variableName, isArray) {
  return (dispatch, getState) => {
    const {assignedVarCache} = getState().inspector;

    // If this call to 'findAndAssign' for this variable wasn't done already, do it now
    if (!assignedVarCache[variableName]) {
      dispatch({type: RECORD_ACTION, action: 'findAndAssign', params: [strategy, selector, variableName, isArray]});
      dispatch({type: ADD_ASSIGNED_VAR_CACHE, varName: variableName});
    }
  };
}

export function setLocatorTestElement (elementId) {
  return async (dispatch) => {
    dispatch({type: SET_LOCATOR_TEST_ELEMENT, elementId});
    dispatch({type: CLEAR_SEARCHED_FOR_ELEMENT_BOUNDS});
    if (elementId) {
      try {
        const [location, size] = await(B.all([
          callClientMethod({methodName: 'getLocation', args: [elementId], skipScreenshotAndSource: true, skipRecord: true}),
          callClientMethod({methodName: 'getSize', args: [elementId], skipScreenshotAndSource: true, skipRecord: true}),
        ]));
        dispatch({type: SET_SEARCHED_FOR_ELEMENT_BOUNDS, location: location.res, size: size.res});
      } catch (ign) { }
    }
  };
}

export function clearSearchResults () {
  return (dispatch) => {
    dispatch({type: CLEAR_SEARCH_RESULTS});
  };
}

export function selectScreenshotInteractionMode (screenshotInteractionMode) {
  return (dispatch) => {
    dispatch({type: SET_SCREENSHOT_INTERACTION_MODE, screenshotInteractionMode });
  };
}

export function setSwipeStart (swipeStartX, swipeStartY) {
  return (dispatch) => {
    dispatch({type: SET_SWIPE_START, swipeStartX, swipeStartY});
  };
}

export function setSwipeEnd (swipeEndX, swipeEndY) {
  return (dispatch) => {
    dispatch({type: SET_SWIPE_END, swipeEndX, swipeEndY});
  };
}

export function clearSwipeAction () {
  return (dispatch) => {
    dispatch({type: CLEAR_SWIPE_ACTION});
  };
}

export function promptKeepAlive () {
  return (dispatch) => {
    dispatch({type: PROMPT_KEEP_ALIVE});
  };
}

export function keepSessionAlive () {
  return (dispatch) => {
    dispatch({type: HIDE_PROMPT_KEEP_ALIVE});
    ipcRenderer.send('appium-keep-session-alive');
  };
}
