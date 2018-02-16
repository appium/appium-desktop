import { ipcRenderer } from 'electron';
import { cloneDeep } from 'lodash';
import settings from '../../settings';
import uuid from 'uuid';
import { callClientMethod } from './shared';
import { CHANGE_SERVER_TYPE, SET_SERVER_PARAM, setLocalServerParamsOnly,
  startSession, showError } from './Session';
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

export const TEST_RUN_REQUESTED = 'TEST_RUN_REQUESTED';
export const TEST_RUNNING = 'TEST_RUNNING';
export const HIDE_TESTRUN_MODAL = 'HIDE_TESTRUN_MODAL';
export const STOP_TEST = 'STOP_TEST';
export const TEST_ACTION_UPDATED = 'TEST_ACTION_UPDATED';
export const TEST_COMPLETE = 'TEST_COMPLETE';

export const ACTION_STATE_PENDING = 'pending';
export const ACTION_STATE_IN_PROGRESS = 'running';
export const ACTION_STATE_COMPLETE = 'complete';
export const ACTION_STATE_ERRORED = 'errored';
export const ACTION_STATE_CANCELED = 'canceled';

export const SAVED_TESTS = 'SAVED_TESTS';
export const TEST_RESULTS = 'TEST_RESULTS';
export const SET_TEST_RESULTS = 'SET_TEST_RESULTS';
export const SHOW_RESULT = 'SHOW_RESULT';

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

export function setServerParam (name, value) {
  return (dispatch, getState) => {
    dispatch({type: SET_SERVER_PARAM, serverType: getState().playbackLibrary.serverType, name, value});
  };
}

export function deleteSavedTest (id) {
  return async (dispatch) => {
    dispatch({type: DELETE_SAVED_TEST_REQUESTED, id});
    const tests = await settings.get(SAVED_TESTS);
    const newTests = tests.filter((t) => t.testId !== id);
    await settings.set(SAVED_TESTS, newTests);
    dispatch({type: SET_SAVED_TESTS, tests: newTests});
    dispatch({type: DELETE_SAVED_TEST_DONE});
  };
}

export function showCapsModal (id) {
  return (dispatch) => {
    dispatch({type: SHOW_CAPS_MODAL, id});
  };
}

export function hideCapsModal () {
  return (dispatch) => {
    dispatch({type: HIDE_CAPS_MODAL});
  };
}

export function hideTestRunModal () {
  return (dispatch) => {
    dispatch({type: HIDE_TESTRUN_MODAL});
  };
}

export function requestTestRun (id) {
  return (dispatch, getState) => {
    dispatch({type: TEST_RUN_REQUESTED, id});
    const {savedTests, serverType} = getState().playbackLibrary;
    const test = savedTests.filter((t) => t.testId === id)[0];
    runTest(serverType, test.caps, test.actions)(dispatch, getState);
  };
}

function initActionsStatus (testActions) {
  return (dispatch) => {
    const newSessionAction = {action: "startSession", params: []};
    const quitSessionAction = {action: "quit", params: []};
    const clonedActions = testActions.map(cloneDeep);
    let actions = [newSessionAction, ...clonedActions, quitSessionAction];

    // every action starts out pending
    for (let a of actions) {
      a.state = ACTION_STATE_PENDING;
      a.err = null;
      a.isElCmd = false;
      a.elListIndex = null;

      // if we have a findAndAssign, rewrite to something we understand
      if (a.action === "findAndAssign") {
        if (a.params[3]) {
          a.action = "findElements";
        } else {
          a.action = "findElement";
        }
      } else if (a.action !== "startSession" && a.action !== "quit") {
        // when other commands come in via actions, they have two params at the
        // front. the first is the name of the variable they will be acting on,
        // which we don't care about. the second is either null, or an integer
        // denoting the index of the element from the last multiple-element
        // find. this is relevant information, but we don't want it on the
        // params list because it won't be included in the actual arguments
        // send to the wd command. so strip it out and do something else with
        // it.
        if (a.params[0] !== null) {
          a.isElCmd = true;
        }
        if (a.params[1] !== null) {
          a.elListIndex = a.params[1];
        }
        a.params = a.params.slice(2);
      }
    }
    dispatch({type: TEST_ACTION_UPDATED, actions});
    return actions;
  };
}

function updateActionStatus (dispatch, getState, actionIndex, state, {err = null, elapsedMs = null, sessionId = null}) {
  let actions = getState().playbackLibrary.actionsStatus;
  const action = actions[actionIndex];
  let newAction = {...action, state, err, elapsedMs};
  if (sessionId) {
    newAction.sessionId = sessionId;
  }
  actions.splice(actionIndex, 1, newAction);
  dispatch({type: TEST_ACTION_UPDATED, actions});
}

export function runTest (serverType, caps, actions) {
  return (dispatch, getState) => {
    const updateState = (index, state, err = null, startTime = null,
        sessionId = null) => {
      // unwrap error
      if (err) {
        let message = null;
        if (err.code) {
          message = err.code;
          if (err.code === "ECONNREFUSED") {
            message = "Could not connect to the server; are you sure it's running?";
          }
        } else if (err.data) {
          message = err.data;
          try {
            message = JSON.parse(err.data).value.message;
          } catch (ign) {}
        } else if (err.message) {
          message = err.message;
        } else if (typeof err === "string") {
          message = err;
        }

        if (!message) {
          message = "An unknown error occurred";
        }

        err = new Error(message);
      }

      let elapsedMs = null;
      if (startTime) {
        elapsedMs = Date.now() - startTime;
      }
      updateActionStatus(dispatch, getState, index, state, {err, elapsedMs, sessionId});
      return Date.now();
    };

    // say that we're running a test
    dispatch({type: TEST_RUNNING});

    // set up initial action states
    actions = initActionsStatus(actions)(dispatch);

    // new session requested
    let startTime = updateState(0, ACTION_STATE_IN_PROGRESS);
    startSession(caps, serverType, getState().session.server);

    // If it failed, show an alert saying it failed
    ipcRenderer.once('appium-new-session-failed', async (evt, e) => {
      updateState(0, ACTION_STATE_ERRORED, e, startTime);
      await completeTest(dispatch, getState);
    });

    ipcRenderer.once('appium-new-session-ready', async (evt, sessionId) => {
      updateState(0, ACTION_STATE_COMPLETE, null, startTime, sessionId);

      // now loop through all the actual test actions
      let actionIndex; // start at 1 since the first action was new session
      let lastFoundElId = null;
      let lastFoundElIds = [];
      const lastActionIndex = actions.length - 1;
      for (actionIndex = 1; actionIndex < lastActionIndex; actionIndex++) {
        const action = actions[actionIndex];
        try {
          startTime = updateState(actionIndex, ACTION_STATE_IN_PROGRESS);
          // unwrap the 'action' format into what callClientMethod expects
          if (action.action.indexOf("findElement") === 0) {
            const [strategy, selector] = action.params;
            const fetchArray = action.action === "findElements";
            const res = await callClientMethod({
              strategy,
              selector,
              fetchArray,
              skipScreenshotAndSource: true
            });
            if (fetchArray) {
              lastFoundElIds = res.elements.map((el) => el.id);
            } else {
              lastFoundElId = res.id;
            }
          } else {
            let elementId = null;
            if (action.isElCmd) {
              if (action.elListIndex !== null) {
                elementId = lastFoundElIds[action.elListIndex];
              } else {
                elementId = lastFoundElId;
              }
            }
            await callClientMethod({
              methodName: action.action,
              args: action.params,
              skipScreenshotAndSource: true,
              elementId,
            });
          }
          updateState(actionIndex, ACTION_STATE_COMPLETE, null, startTime);
        } catch (e) {
          updateState(actionIndex, ACTION_STATE_ERRORED, e, startTime);
          break;
        }
      }
      startTime = updateState(lastActionIndex, ACTION_STATE_IN_PROGRESS);
      try {
        await callClientMethod({
          methodName: 'quit'
        });
        updateState(lastActionIndex, ACTION_STATE_COMPLETE, null, startTime);
      } catch (e) {
        updateState(lastActionIndex, ACTION_STATE_ERRORED, e, startTime);
      }

      await completeTest(dispatch, getState);
    });
  };
}

async function completeTest (dispatch, getState) {
  const state = getState().playbackLibrary;
  const serverType = state.serverType;
  const actions = state.actionsStatus;
  const date = Date.now();
  const testId = state.testToRun;
  const test = getTest(testId, state.savedTests);
  const {caps, name} = test;
  const resultId = uuid.v4();
  const result = {name, testId, date, actions, serverType, caps, resultId};

  const results = await settings.get(TEST_RESULTS);
  const newResults = [result, ...results];
  await settings.set(TEST_RESULTS, newResults);
  dispatch({type: TEST_COMPLETE});
  dispatch({type: SET_TEST_RESULTS, results: newResults});
}

export function getTestResults () {
  return async (dispatch) => {
    const results = await settings.get(TEST_RESULTS);
    dispatch({type: SET_TEST_RESULTS, results});
  };
}

export function deleteTestResult (id) {
  return async (dispatch) => {
    const results = await settings.get(TEST_RESULTS);
    const newResults = results.filter((r) => r.resultId !== id);
    await settings.set(TEST_RESULTS, newResults);
    dispatch({type: SET_TEST_RESULTS, results: newResults});
  };
}

export function showTestResult (id) {
  return (dispatch) => {
    dispatch({type: SHOW_RESULT, id});
  };
}


export function getTestResult (id, testResults) {
  return testResults.filter((r) => r.resultId === id)[0];
}

export function getTest (id, savedTests) {
  return savedTests.filter((r) => r.testId === id)[0];
}
