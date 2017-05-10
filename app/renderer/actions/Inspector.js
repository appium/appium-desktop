import { ipcRenderer } from 'electron';
import { notification } from 'antd';
import { push } from 'react-router-redux';
import { showError } from './Session';
import { callClientMethod } from './shared';

export const SET_SOURCE_AND_SCREENSHOT = 'SET_SOURCE';
export const SESSION_DONE = 'SESSION_DONE';
export const SELECT_ELEMENT = 'SELECT_ELEMENT';
export const UNSELECT_ELEMENT = 'UNSELECT_ELEMENT';
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

/**
 * Translates sourceXML to JSON
 */
function xmlToJSON (source) {
  let recursive = (xmlNode, parentPath, index) => {

    // Get a dot separated path (root doesn't have a path)
    let path = (index !== undefined) && `${!parentPath ? '' : parentPath + '.'}${index}`;

    // Get an xpath for this element as well to use for Appium calls
    let xpath = path && path.split('.').map((index) => `${path.length === 0 ? '/' : '//'}*[${parseInt(index, 10) + 1}]`).join('');

    // Translate attributes array to an object
    let attrObject = {};
    for (let attribute of xmlNode.attributes || []) {
      attrObject[attribute.name] = attribute.value;
    }

    return {
      children: [...xmlNode.children].map((childNode, childIndex) => recursive(childNode, path, childIndex)),
      tagName: xmlNode.tagName,
      attributes: attrObject,
      path,
      xpath,
    };
  };

  let sourceXML = (new DOMParser()).parseFromString(source, 'text/xml').children[0];
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
  return (dispatch, getState) => {
    dispatch({type: SELECT_ELEMENT, path});

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
  return async (dispatch) => {
    try {
      dispatch({type: METHOD_CALL_REQUESTED});
      let {source, screenshot, result} = await callClientMethod(params.methodName, params.args, params.xpath);
      dispatch({type: METHOD_CALL_DONE});
      dispatch({type: SET_SOURCE_AND_SCREENSHOT, source: xmlToJSON(source), screenshot});
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
