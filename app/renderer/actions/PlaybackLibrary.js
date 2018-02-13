import settings from '../../settings';
import { CHANGE_SERVER_TYPE, setLocalServerParamsOnly } from './Session';
import { SET_SAVED_TESTS } from './Inspector';

export const NEW_PLAYBACK_SESSION_REQUESTED = 'NEW_PLAYBACK_REQUESTED';
export const NEW_PLAYBACK_SESSION_BEGAN = 'NEW_PLAYBACK_BEGAN';
export const NEW_PLAYBACK_SESSION_DONE = 'NEW_PLAYBACK_DONE';
export const CHANGE_TEST = 'CHANGE_TEST';
export const GET_SAVED_TESTS_REQUESTED = 'GET_SAVED_TESTS_REQUESTED';
export const GET_SAVED_TESTS_DONE = 'GET_SAVED_TESTS_DONE';
export const DELETE_SAVED_TEST_REQUESTED = 'DELETE_SAVED_TEST_REQUESTED';
export const DELETE_SAVED_TEST_DONE = 'DELETE_SAVED_TEST_DONE';
export const PLAYBACK_LOADING = 'PLAYBACK_LOADING';
export const PLAYBACK_LOADING_DONE = 'PLAYBACK_LOADING_DONE';
export const SHOW_CAPS_MODAL = 'SHOW_CAPS_MODAL';
export const HIDE_CAPS_MODAL = 'HIDE_CAPS_MODAL';

export const SAVED_TESTS = 'SAVED_TESTS';

export function changeServerType (serverType) {
  return (dispatch) => {
    dispatch({type: CHANGE_SERVER_TYPE, serverType});
  };
}

export function setLocalServerParams () {
  return async (dispatch, getState) => {
    if (!await setLocalServerParamsOnly(dispatch) &&
        getState().playbackLibrary.serverType === 'local') {
      changeServerType('remote')(dispatch);
    }
  };
}

export function deleteSavedTest (name) {
  return async (dispatch) => {
    dispatch({type: DELETE_SAVED_TEST_REQUESTED, name});
    const tests = await settings.get(SAVED_TESTS);
    const newTests = tests.filter((t) => t.name !== name);
    await settings.set(SAVED_TESTS, newTests);
    dispatch({type: SET_SAVED_TESTS, tests: newTests});
    dispatch({type: DELETE_SAVED_TEST_DONE});
  };
}

export function showCapsModal (name) {
  return (dispatch) => {
    dispatch({type: SHOW_CAPS_MODAL, name});
  };
}

export function hideCapsModal () {
  return (dispatch) => {
    dispatch({type: HIDE_CAPS_MODAL});
  };
}
