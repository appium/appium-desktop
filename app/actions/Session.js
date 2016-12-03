import { ipcRenderer } from 'electron';
import settings from 'electron-settings';

export const NEW_SESSION_REQUESTED = 'NEW_SESSION_REQUESTED';
export const NEW_SESSION_BEGAN = 'NEW_SESSION_BEGAN';
export const NEW_SESSION_DONE = 'NEW_SESSION_DONE';
export const CHANGE_CAPABILITY = 'CHANGE_CAPABILITY';
export const SAVE_SESSION_REQUESTED = 'SAVE_SESSION_REQUESTED';
export const SAVE_SESSION_DONE = 'SAVE_SESSION_DONE';
export const GET_SAVED_SESSIONS_REQUESTED = 'GET_SAVED_SESSIONS_REQUESTED';
export const GET_SAVED_SESSIONS_DONE = 'GET_SAVED_SESSIONS_DONE';
export const SET_CAPABILITY_PARAM = 'SET_CAPABILITY_PARAM';
export const ADD_CAPABILITY = 'ADD_CAPABILITY';
export const REMOVE_CAPABILITY = 'REMOVE_CAPABILITY';
export const SWITCHED_TABS = 'SWITCHED_TABS';
export const SET_CAPS = 'SET_CAPS';
export const SAVE_AS_MODAL_REQUESTED = 'SAVE_AS_MODAL_REQUESTED';
export const HIDE_SAVE_AS_MODAL_REQUESTED = 'HIDE_SAVE_AS_MODAL_REQUESTED';
export const SET_SAVE_AS_TEXT = 'SET_SAVE_AS_TEXT';
export const DELETE_SAVED_SESSION_REQUESTED = 'DELETE_SAVED_SESSION_REQUESTED';
export const DELETE_SAVED_SESSION_DONE = 'DELETE_SAVED_SESSION_DONE';

const SAVED_SESSIONS = 'SAVED_SESSIONS';

function getCapsObject (caps) {
  let capsObject = {};
  caps.forEach((cap) => capsObject[cap.name] = cap.value);
  return capsObject;
}

/**
 * Change the caps object and then go back to the new session tab
 */
export function setCaps (caps) {
  return async (dispatch) => {
    dispatch({type: SET_CAPS, caps});
    switchTabs('new')(dispatch);
  };
}

/**
 * Change a single desired capability
 */
export function changeCapability (key, value) {
  return async (dispatch) => {
    dispatch({type: CHANGE_CAPABILITY, key, value});
  };
}

export function addCapability () {
  return async (dispatch) => {
    dispatch({type: ADD_CAPABILITY});
  };
}

export function setCapabilityParam (index, name, value) {
  return async (dispatch) => {
    dispatch({type: SET_CAPABILITY_PARAM, index, name, value});
  };
}

export function removeCapability (index) {
  return async (dispatch) => {
    dispatch({type: REMOVE_CAPABILITY, index});
  };
}

/**
 * Start a new appium session with the given caps 
 */
export function newSession (caps) {
  return async (dispatch) => {
    dispatch({type: NEW_SESSION_REQUESTED, caps});

    let desiredCapabilitiesObj = getCapsObject(caps);

    // Start the session
    ipcRenderer.send('appium-create-new-session', desiredCapabilitiesObj);

    ipcRenderer.once('appium-new-session-failed', (event, message) => {
      alert('Error starting session');
    });

    ipcRenderer.once('appium-new-session-done', () => {
      dispatch({type: NEW_SESSION_DONE});
    });

    dispatch({type: NEW_SESSION_BEGAN});
  };
}


/**
 * Saves the caps
 */
export function saveSession (name, caps) {
  return async (dispatch) => {
    dispatch({type: SAVE_SESSION_REQUESTED});
    let savedSessions = await settings.get(SAVED_SESSIONS) || [];
    savedSessions.push({
      date: +(new Date()),
      name,
      caps,
    });
    await settings.set(SAVED_SESSIONS, savedSessions);
    dispatch({type: SAVE_SESSION_DONE});
    getSavedSessions()(dispatch);
  };
}

/**
 * Get the sessions saved by the user
 */
export function getSavedSessions () {
  return async (dispatch) => {
    dispatch({type: GET_SAVED_SESSIONS_REQUESTED});
    let savedSessions = await settings.get(SAVED_SESSIONS) || [];
    dispatch({type: GET_SAVED_SESSIONS_DONE, savedSessions});
  };
}

/**
 * Switch to a different tab
 */
export function switchTabs (key) {
  return async (dispatch) => {
    dispatch({type: SWITCHED_TABS, key});
  };
}

export function requestSaveAsModal () {
  return async (dispatch) => {
    dispatch({type: SAVE_AS_MODAL_REQUESTED});
  };
}

export function hideSaveAsModal () {
  return async (dispatch) => {
    dispatch({type: HIDE_SAVE_AS_MODAL_REQUESTED});
  };
}

export function setSaveAsText (saveAsText) {
  return async (dispatch) => {
    dispatch({type: SET_SAVE_AS_TEXT, saveAsText});
  };
}

export function deleteSavedSession (index) {
  return async (dispatch) => {
    dispatch({type: DELETE_SAVED_SESSION_REQUESTED, index});
    let savedSessions = await settings.get(SAVED_SESSIONS) || [];
    savedSessions.splice(index, 1);
    await settings.set(SAVED_SESSIONS, savedSessions);
    dispatch({type: GET_SAVED_SESSIONS_DONE, savedSessions});
  };
}