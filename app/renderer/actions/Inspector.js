import { ipcRenderer } from 'electron';
import _ from 'lodash';
import { push } from 'connected-react-router';
import { getLocators, APP_MODE } from '../components/Inspector/shared';
import { showError } from './Session';
import { xmlToJSON } from '../util';
import frameworks from '../lib/client-frameworks';
import settings, { SAVED_FRAMEWORK } from '../../shared/settings';
import i18n from '../../configs/i18next.config.renderer';
import AppiumClient from '../lib/appium-client';
import { notification } from 'antd';

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
export const RECORD_ACTION = 'RECORD_ACTION';
export const SET_SHOW_BOILERPLATE = 'SET_SHOW_BOILERPLATE';

export const SHOW_LOCATOR_TEST_MODAL = 'SHOW_LOCATOR_TEST_MODAL';
export const HIDE_LOCATOR_TEST_MODAL = 'HIDE_LOCATOR_TEST_MODAL';
export const SET_LOCATOR_TEST_STRATEGY = 'SET_LOCATOR_TEST_STRATEGY';
export const SET_LOCATOR_TEST_VALUE = 'SET_LOCATOR_TEST_VALUE';
export const SEARCHING_FOR_ELEMENTS = 'SEARCHING_FOR_ELEMENTS';
export const SEARCHING_FOR_ELEMENTS_COMPLETED = 'SEARCHING_FOR_ELEMENTS_COMPLETED';
export const GET_FIND_ELEMENTS_TIMES = 'GET_FIND_ELEMENTS_TIMES';
export const GET_FIND_ELEMENTS_TIMES_COMPLETED = 'GET_FIND_ELEMENTS_TIMES_COMPLETED';
export const SET_LOCATOR_TEST_ELEMENT = 'SET_LOCATOR_TEST_ELEMENT';
export const CLEAR_SEARCH_RESULTS = 'CLEAR_SEARCH_RESULTS';
export const ADD_ASSIGNED_VAR_CACHE = 'ADD_ASSIGNED_VAR_CACHE';
export const CLEAR_ASSIGNED_VAR_CACHE = 'CLEAR_ASSIGNED_VAR_CACHE';
export const SET_SCREENSHOT_INTERACTION_MODE = 'SET_SCREENSHOT_INTERACTION_MODE';
export const SET_APP_MODE = 'SET_APP_MODE';
export const SET_SEARCHED_FOR_ELEMENT_BOUNDS = 'SET_SEARCHED_FOR_ELEMENT_BOUNDS';
export const CLEAR_SEARCHED_FOR_ELEMENT_BOUNDS = 'CLEAR_SEARCHED_FOR_ELEMENT_BOUNDS';

export const SET_SWIPE_START = 'SET_SWIPE_START';
export const SET_SWIPE_END = 'SET_SWIPE_END';
export const CLEAR_SWIPE_ACTION = 'CLEAR_SWIPE_ACTION';
export const PROMPT_KEEP_ALIVE = 'PROMPT_KEEP_ALIVE';
export const HIDE_PROMPT_KEEP_ALIVE = 'HIDE_PROMPT_KEEP_ALIVE';

export const SELECT_INTERACTION_MODE = 'SELECT_INTERACTION_MODE';

export const SELECT_ACTION_GROUP = 'SELECT_ACTION_GROUP';
export const SELECT_SUB_ACTION_GROUP = 'SELECT_SUB_ACTION_GROUP';

export const ENTERING_ACTION_ARGS = 'ENTERING_ACTION_ARGS';
export const REMOVE_ACTION = 'REMOVE_ACTION';
export const SET_ACTION_ARG = 'SET_ACTION_ARG';

export const SET_CONTEXT = 'SET_CONTEXT';

export const SET_KEEP_ALIVE_INTERVAL = 'SET_KEEP_ALIVE_INTERVAL';
export const SET_USER_WAIT_TIMEOUT = 'SET_USER_WAIT_TIMEOUT';
export const SET_LAST_ACTIVE_MOMENT = 'SET_LAST_ACTIVE_MOMENT';

const KEEP_ALIVE_PING_INTERVAL = 5 * 1000;
const NO_NEW_COMMAND_LIMIT = 24 * 60 * 60 * 1000; // Set timeout to 24 hours
const WAIT_FOR_USER_KEEP_ALIVE = 60 * 60 * 1000; // Give user 1 hour to reply

// A debounced function that calls findElement and gets info about the element
const findElement = _.debounce(async function (strategyMap, dispatch, getState, path) {
  for (let [strategy, selector] of strategyMap) {
    // Get the information about the element
    const action = callClientMethod({
      strategy,
      selector,
    });
    let {elementId, variableName, variableType} = await action(dispatch, getState);

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
    const isRecording = params.methodName !== 'quit' &&
                      params.methodName !== 'getPageSource' &&
                      getState().inspector.isRecording;
    try {
      dispatch({type: METHOD_CALL_REQUESTED});
      const callAction = callClientMethod(params);
      const {contexts, contextsError, currentContext, currentContextError,
             source, screenshot, windowSize, result, sourceError,
             screenshotError, windowSizeError, variableName,
             variableIndex, strategy, selector} = await callAction(dispatch, getState);

      if (isRecording) {
        // Add 'findAndAssign' line of code. Don't do it for arrays though. Arrays already have 'find' expression
        if (strategy && selector && !variableIndex && variableIndex !== 0) {
          const findAction = findAndAssign(strategy, selector, variableName, false);
          findAction(dispatch, getState);
        }

        // now record the actual action
        let args = [variableName, variableIndex];
        args = args.concat(params.args || []);
        dispatch({type: RECORD_ACTION, action: params.methodName, params: args });
      }
      dispatch({type: METHOD_CALL_DONE});

      if (source && screenshot) {
        dispatch({
          type: SET_SOURCE_AND_SCREENSHOT,
          contexts,
          currentContext,
          source: source && xmlToJSON(source),
          sourceXML: source,
          screenshot,
          windowSize,
          contextsError,
          currentContextError,
          sourceError,
          screenshotError,
          windowSizeError,
        });
      }
      return result;
    } catch (error) {
      console.log(error); // eslint-disable-line no-console
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
export function quitSession (reason, killedByUser = true) {
  return async (dispatch, getState) => {
    const killAction = killKeepAliveLoop();
    killAction(dispatch, getState);
    const applyAction = applyClientMethod({methodName: 'quit'});
    await applyAction(dispatch, getState);
    dispatch({type: QUIT_SESSION_DONE});
    dispatch(push('/session'));
    if (!killedByUser) {
      notification.error({
        message: 'Error',
        description: reason || i18n.t('Session has been terminated'),
        duration: 0
      });
    }
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
      throw new Error(i18n.t('frameworkNotSupported', {framework}));
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

export function setSessionDetails (driver, sessionDetails) {
  return (dispatch) => {
    dispatch({type: SET_SESSION_DETAILS, driver, sessionDetails});
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

export function setContext (context) {
  return (dispatch) => {
    dispatch({type: SET_CONTEXT, context});
  };
}

export function searchForElement (strategy, selector) {
  return async (dispatch, getState) => {
    dispatch({type: SEARCHING_FOR_ELEMENTS});
    try {
      const callAction = callClientMethod({strategy, selector, fetchArray: true});
      let {elements, variableName} = await callAction(dispatch, getState);
      const findAction = findAndAssign(strategy, selector, variableName, true);
      findAction(dispatch, getState);
      elements = elements.map((el) => el.id);
      dispatch({type: SEARCHING_FOR_ELEMENTS_COMPLETED, elements});
    } catch (error) {
      dispatch({type: SEARCHING_FOR_ELEMENTS_COMPLETED});
      showError(error, 10);
    }
  };
}

/**
 * Get all the find element times based on the find data source
 */
export function getFindElementsTimes (findDataSource) {
  return async (dispatch, getState) => {
    dispatch({type: GET_FIND_ELEMENTS_TIMES});
    try {
      const findElementsExecutionTimes = [];
      for (const element of findDataSource) {
        const {find, key, selector} = element;
        const action = callClientMethod({strategy: key, selector});
        const {executionTime} = await action(dispatch, getState);
        findElementsExecutionTimes.push({find, key, selector, time: executionTime});
      }

      dispatch({
        type: GET_FIND_ELEMENTS_TIMES_COMPLETED,
        findElementsExecutionTimes: _.sortBy(findElementsExecutionTimes, ['time']),
      });
    } catch (error) {
      dispatch({type: GET_FIND_ELEMENTS_TIMES_COMPLETED});
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
  return async (dispatch, getState) => {
    dispatch({type: SET_LOCATOR_TEST_ELEMENT, elementId});
    dispatch({type: CLEAR_SEARCHED_FOR_ELEMENT_BOUNDS});
    if (elementId) {
      try {
        const action = callClientMethod({
          methodName: 'getRect',
          args: [elementId],
          skipRefresh: true,
          skipRecord: true,
          ignoreResult: true
        });
        const rect = await action(dispatch, getState);
        dispatch({
          type: SET_SEARCHED_FOR_ELEMENT_BOUNDS,
          location: {x: rect.x, y: rect.y},
          size: {width: rect.width, height: rect.height},
        });
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

export function selectAppMode (mode) {
  return async (dispatch, getState) => {
    const {appMode} = getState().inspector;
    dispatch({type: SET_APP_MODE, mode});
    // if we're transitioning to hybrid mode, do a pre-emptive search for contexts
    if (appMode !== mode && mode === APP_MODE.WEB_HYBRID) {
      const action = applyClientMethod({methodName: 'getPageSource'});
      await action(dispatch, getState);
    }
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

export function hideKeepAlivePrompt () {
  return (dispatch) => {
    dispatch({type: HIDE_PROMPT_KEEP_ALIVE});
  };
}

export function selectActionGroup (group) {
  return (dispatch) => {
    dispatch({type: SELECT_ACTION_GROUP, group});
  };
}

export function selectSubActionGroup (group) {
  return (dispatch) => {
    dispatch({type: SELECT_SUB_ACTION_GROUP, group});
  };
}

export function selectInteractionMode (interaction) {
  return (dispatch) => {
    dispatch({type: SELECT_INTERACTION_MODE, interaction});
  };
}

export function startEnteringActionArgs (actionName, action) {
  return (dispatch) => {
    dispatch({type: ENTERING_ACTION_ARGS, actionName, action});
  };
}

export function cancelPendingAction () {
  return (dispatch) => {
    dispatch({type: REMOVE_ACTION});
  };
}

export function setActionArg (index, value) {
  return (dispatch) => {
    dispatch({type: SET_ACTION_ARG, index, value});
  };
}

/**
 * Ping server every 30 seconds to prevent `newCommandTimeout` from killing session
 */
export function runKeepAliveLoop () {
  return (dispatch, getState) => {
    dispatch({type: SET_LAST_ACTIVE_MOMENT, lastActiveMoment: Date.now()});
    const {driver} = getState().inspector;

    const keepAliveInterval = setInterval(async () => {
      const {lastActiveMoment} = getState().inspector;
      console.log('Pinging Appium server to keep session active'); // eslint-disable-line no-console
      try {
        await driver.getTimeouts(); // Pings the Appium server to keep it alive
      } catch (ign) {}
      const now = Date.now();

      // If the new command limit has been surpassed, prompt user if they want to keep session going
      // Give them WAIT_FOR_USER_KEEP_ALIVE ms to respond
      if (now - lastActiveMoment > NO_NEW_COMMAND_LIMIT) {
        const action = promptKeepAlive();
        action(dispatch);

        // After the time limit kill the session (this timeout will be killed if they keep it alive)
        const userWaitTimeout = setTimeout(() => {
          const action = quitSession('Session closed due to inactivity', false);
          action(dispatch, getState);
        }, WAIT_FOR_USER_KEEP_ALIVE);
        dispatch({type: SET_USER_WAIT_TIMEOUT, userWaitTimeout});
      }
    }, KEEP_ALIVE_PING_INTERVAL);
    dispatch({type: SET_KEEP_ALIVE_INTERVAL, keepAliveInterval});
  };
}

/**
 * Get rid of the intervals to keep the session alive
 */
export function killKeepAliveLoop () {
  return (dispatch, getState) => {
    const {keepAliveInterval, userWaitTimeout} = getState().inspector;
    clearInterval(keepAliveInterval);
    if (userWaitTimeout) {
      clearTimeout(userWaitTimeout);
    }
    dispatch({type: SET_KEEP_ALIVE_INTERVAL, keepAliveInterval: null});
    dispatch({type: SET_USER_WAIT_TIMEOUT, userWaitTimeout: null});
  };
}

/**
 * Reset the new command clock and kill the wait for user timeout
 */
export function keepSessionAlive () {
  return (dispatch, getState) => {
    const {userWaitTimeout} = getState().inspector;
    const action = hideKeepAlivePrompt();
    action(dispatch);
    dispatch({type: SET_LAST_ACTIVE_MOMENT, lastActiveMoment: +(new Date())});
    if (userWaitTimeout) {
      clearTimeout(userWaitTimeout);
      dispatch({type: SET_USER_WAIT_TIMEOUT, userWaitTimeout: null});
    }
  };
}

export function callClientMethod (params) {
  return async (dispatch, getState) => {
    console.log(`Calling client method with params:`); // eslint-disable-line no-console
    console.log(params); // eslint-disable-line no-console
    const {driver, appMode} = getState().inspector;
    const {methodName, ignoreResult = true} = params;
    params.appMode = appMode;

    const action = keepSessionAlive();
    action(dispatch, getState);
    const client = AppiumClient.instance(driver);
    const res = await client.run(params);
    let {commandRes} = res;

    // Ignore empty objects
    if (_.isObject(res) && _.isEmpty(res)) {
      commandRes = null;
    }

    if (!ignoreResult) {
      const truncatedResult = _.truncate(JSON.stringify(commandRes), {length: 2000});
      console.log(`Result of client command was:`); // eslint-disable-line no-console
      console.log(truncatedResult); // eslint-disable-line no-console
      notification.success({
        message: i18n.t('methodCallResult', {methodName}),
        description: truncatedResult,
        duration: 0,
      });
    }
    res.elementId = res.id;
    return res;
  };
}
