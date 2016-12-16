import { ipcRenderer } from 'electron';
import { message } from 'antd';

export const SET_SOURCE_AND_SCREENSHOT = 'SET_SOURCE';
export const QUIT_SESSION_REQUESTED = 'QUIT_SESSION_REQUESTED';
export const SESSION_DONE = 'SESSION_DONE';
export const SELECT_ELEMENT = 'SELECT_ELEMENT';
export const UNSELECT_ELEMENT = 'UNSELECT_ELEMENT';
export const METHOD_CALL_REQUESTED = 'METHOD_CALL_REQUESTED';
export const METHOD_CALL_DONE = 'METHOD_CALL_DONE';
export const SET_FIELD_VALUE = 'SET_FIELD_VALUE';
export const SET_EXPANDED_PATHS = 'SET_EXPANDED_PATHS';
export const SELECT_HOVERED_ELEMENT = 'SELECT_HOVERED_ELEMENT';
export const UNSELECT_HOVERED_ELEMENT = 'UNSELECT_HOVERED_ELEMENT';

export function bindAppium () {
  return async (dispatch) => {
    ipcRenderer.on('appium-session-done', () => {
      message.error('Session has been terminated', 100000);
      ipcRenderer.removeAllListeners('appium-client-command-response');
      ipcRenderer.removeAllListeners('appium-client-command-response-error');
      dispatch({type: SESSION_DONE});
    });

    ipcRenderer.on('appium-client-command-response', (evt, resp) => {
      const {source, screenshot} = resp;

      // Convert the sourceXML to JSON
      let recursive = (xmlNode, parentPath, index) => {

        // Get a dot separated path (root doesn't have a path)
        let path = (index !== undefined) && `${!parentPath ? '' : parentPath + '.'}${index}`;

        // Get an xpath for this element as well to use for Appium calls
        let xpath = path && path.split('.').map((index) => `//*[${parseInt(index, 10) + 1}]`).join('');

        // Translate attributes array to an object
        let attrObject = {};
        [...(xmlNode.attributes || [])].forEach((attribute) => attrObject[attribute.name] = attribute.value);

        return {
          children: [...xmlNode.children].map((childNode, childIndex) => recursive(childNode, path, childIndex)),
          tagName: xmlNode.tagName,
          attributes: attrObject,
          path,
          xpath,
        };
      };

      let sourceXML = (new DOMParser()).parseFromString(source, 'text/xml');
      let sourceJSON = recursive(sourceXML);

      dispatch({type: SET_SOURCE_AND_SCREENSHOT, source: sourceJSON, screenshot});
      dispatch({type: METHOD_CALL_DONE});
    });

    ipcRenderer.once('appium-client-command-response-error', (e, reason) => {
      message.error(`Could not complete method: ${reason.message}`, 10);
      dispatch({type: METHOD_CALL_DONE});
    });
  };
}

export function selectElement (path) {
  return async (dispatch, getState) => {
    dispatch({type: SELECT_ELEMENT, path});

    // Expand all of this element's ascendants so that it's visible in the tree
    let { expandedPaths } = getState().inspector;
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
  return async (dispatch) => {
    dispatch({type: UNSELECT_ELEMENT});
  };
}

export function selectHoveredElement (path) {
  return async (dispatch) => {
    dispatch({type: SELECT_HOVERED_ELEMENT, path});
  };
}

export function unselectHoveredElement (path) {
  return async (dispatch) => {
    dispatch({type: UNSELECT_HOVERED_ELEMENT, path});
  };
}

/**
 * Requests a method call on appium 
 */
export function applyClientMethod (params) {
  return async (dispatch) => {
    ipcRenderer.send('appium-client-command-request', params);
    dispatch({type: METHOD_CALL_REQUESTED});
  };
}

/**
 * Set a value of an arbitrarily named field
 */
export function setFieldValue (name, value) {
  return async (dispatch) => {
    dispatch({type: SET_FIELD_VALUE, name, value});
  };
}

export function setExpandedPaths (paths) {
  return async (dispatch) => {
    dispatch({type: SET_EXPANDED_PATHS, paths});
  };
}