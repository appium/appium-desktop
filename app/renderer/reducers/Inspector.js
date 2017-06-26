import { omit } from 'lodash';

import { SET_SOURCE_AND_SCREENSHOT, QUIT_SESSION_REQUESTED, QUIT_SESSION_DONE,
  SESSION_DONE, SELECT_ELEMENT, UNSELECT_ELEMENT, SELECT_HOVERED_ELEMENT,
  UNSELECT_HOVERED_ELEMENT, METHOD_CALL_REQUESTED, METHOD_CALL_DONE,
  SET_FIELD_VALUE, SET_EXPANDED_PATHS, SHOW_SEND_KEYS_MODAL,
  HIDE_SEND_KEYS_MODAL, START_RECORDING, PAUSE_RECORDING, CLEAR_RECORDING,
  SET_ACTION_FRAMEWORK, RECORD_ACTION, CLOSE_RECORDER, SET_SHOW_BOILERPLATE,
  SET_SESSION_DETAILS
} from '../actions/Inspector';

const DEFAULT_FRAMEWORK = 'java';

const INITIAL_STATE = {
  expandedPaths: ['0'],
  isRecording: false,
  showRecord: false,
  showBoilerplate: false,
  recordedActions: [],
  actionFramework: DEFAULT_FRAMEWORK,
  sessionDetails: {},
};

/**
 * Look up an element in the source with the provided path
 */
function findElementByPath (path, source) {
  let selectedElement = source;
  for (let index of path.split('.')) {
    selectedElement = selectedElement.children[index];
  }
  return {...selectedElement};
}

export default function inspector (state=INITIAL_STATE, action) {
  switch (action.type) {
    case SET_SOURCE_AND_SCREENSHOT:
      return {
        ...state,
        source: action.source,
        sourceError: action.sourceError,
        screenshot: action.screenshot,
        screenshotError: action.screenshotError,
      };

    case QUIT_SESSION_REQUESTED:
      return {
        ...state,
        methodCallInProgress: true,
        isQuittingSession: true,
      };

    case QUIT_SESSION_DONE:
      return {
        ...INITIAL_STATE
      };

    case SESSION_DONE:
      return {
        ...state,
        isSessionDone: true,
        methodCallInProgress: false,
      };

    case SELECT_ELEMENT:
      return {
        ...state,
        selectedElement: findElementByPath(action.path, state.source),
      };

    case UNSELECT_ELEMENT:
      return omit(state, 'selectedElement');

    case SELECT_HOVERED_ELEMENT:
      return {
        ...state,
        hoveredElement: findElementByPath(action.path, state.source),
      };

    case UNSELECT_HOVERED_ELEMENT:
      return omit(state, 'hoveredElement');

    case METHOD_CALL_REQUESTED:
      return {
        ...state,
        methodCallInProgress: true,
      };

    case METHOD_CALL_DONE:
      return {
        ...state,
        methodCallInProgress: false,
      };

    case SET_FIELD_VALUE:
      return {
        ...state,
        [action.name]: action.value,
      };

    case SET_EXPANDED_PATHS:
      return {
        ...state,
        expandedPaths: action.paths,
      };

    case SHOW_SEND_KEYS_MODAL:
      return {
        ...state,
        sendKeysModalVisible: true
      };

    case HIDE_SEND_KEYS_MODAL:
      const nextState = omit(state, 'sendKeysModalVisible');
      return omit(nextState, 'action.sendKeys');

    case START_RECORDING:
      return {
        ...state,
        isRecording: true,
        showRecord: true
      };

    case PAUSE_RECORDING:
      return {
        ...state,
        isRecording: false,
        showRecord: state.recordedActions.length > 0
      };

    case CLEAR_RECORDING:
      return {
        ...state,
        recordedActions: []
      };

    case SET_ACTION_FRAMEWORK:
      return {
        ...state,
        actionFramework: action.framework || DEFAULT_FRAMEWORK
      };

    case RECORD_ACTION:
      return {
        ...state,
        recordedActions: [
          ...state.recordedActions,
          {action: action.action, params: action.params}
        ]
      };

    case CLOSE_RECORDER:
      return {
        ...state,
        showRecord: false
      };

    case SET_SHOW_BOILERPLATE:
      return {...state, showBoilerplate: action.show};

    case SET_SESSION_DETAILS:
      return {...state, sessionDetails: action.sessionDetails};

    default:
      return {...state};
  }
}
