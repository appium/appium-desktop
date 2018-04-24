import { omit } from 'lodash';

import { SET_SOURCE_AND_SCREENSHOT, QUIT_SESSION_REQUESTED, QUIT_SESSION_DONE,
  SESSION_DONE, SELECT_ELEMENT, UNSELECT_ELEMENT, SELECT_HOVERED_ELEMENT, SET_SELECTED_ELEMENT_ID, SET_INTERACTIONS_NOT_AVAILABLE,
  UNSELECT_HOVERED_ELEMENT, METHOD_CALL_REQUESTED, METHOD_CALL_DONE,
  SET_FIELD_VALUE, SET_EXPANDED_PATHS, SHOW_SEND_KEYS_MODAL,
  HIDE_SEND_KEYS_MODAL, START_RECORDING, PAUSE_RECORDING, CLEAR_RECORDING,
  SET_ACTION_FRAMEWORK, RECORD_ACTION, CLOSE_RECORDER, SET_SHOW_BOILERPLATE, SET_SESSION_DETAILS, 
  SHOW_LOCATOR_TEST_MODAL, HIDE_LOCATOR_TEST_MODAL, SET_LOCATOR_TEST_STRATEGY, SET_LOCATOR_TEST_VALUE,
  SEARCHING_FOR_ELEMENTS, SEARCHING_FOR_ELEMENTS_COMPLETED, SET_LOCATOR_TEST_ELEMENT, CLEAR_SEARCH_RESULTS, 
  ADD_ASSIGNED_VAR_CACHE, CLEAR_ASSIGNED_VAR_CACHE, SET_SCREENSHOT_INTERACTION_MODE,
  SET_SWIPE_START, SET_SWIPE_END, CLEAR_SWIPE_ACTION, SET_SEARCHED_FOR_ELEMENT_BOUNDS, CLEAR_SEARCHED_FOR_ELEMENT_BOUNDS,
  PROMPT_KEEP_ALIVE, HIDE_PROMPT_KEEP_ALIVE
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
  isLocatorTestModalVisible: false,
  locatorTestStrategy: 'id',
  locatorTestValue: '',
  isSearchingForElements: false,
  assignedVarCache: {},
  screenshotInteractionMode: 'select',
  searchedForElementBounds: null,
  showKeepAlivePrompt: false,
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
        sourceXML: action.sourceXML,
        sourceError: action.sourceError,
        screenshot: action.screenshot,
        screenshotError: action.screenshotError,
        windowSize: action.windowSize,
        windowSizeError: action.windowSizeError,
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
        selectedElementPath: action.path,
        selectedElementId: null,
        selectedElementVariableName: null,
        selectedElementVariableType: null,
        elementInteractionsNotAvailable: false,
      };

    case UNSELECT_ELEMENT:
      return {
        ...state,
        selectedElement: undefined,
        selectedElementPath: null,
        selectedElementId: null,
        selectedElementVariableName: null,
        selectedElementVariableType: null,
      };

    case SET_SELECTED_ELEMENT_ID:
      return {
        ...state,
        selectedElementId: action.elementId,
        selectedElementVariableName: action.variableName,
        selectedElementVariableType: action.variableType,
      };

    case SET_INTERACTIONS_NOT_AVAILABLE:
      return {
        ...state,
        elementInteractionsNotAvailable: true,
      };

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

    case ADD_ASSIGNED_VAR_CACHE:
      return {
        ...state,
        assignedVarCache: {
          ...state.assignedVarCache,
          [action.varName]: true,
        }
      };

    case CLEAR_ASSIGNED_VAR_CACHE:
      return {
        ...state,
        assignedVarCache: [],
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

    case SHOW_LOCATOR_TEST_MODAL:
      return {
        ...state,
        isLocatorTestModalVisible: true,
      };

    case HIDE_LOCATOR_TEST_MODAL:
      return {
        ...state,
        isLocatorTestModalVisible: false,
      };

    case SET_LOCATOR_TEST_STRATEGY:
      return {
        ...state,
        locatorTestStrategy: action.locatorTestStrategy
      };

    case SET_LOCATOR_TEST_VALUE:
      return {
        ...state,
        locatorTestValue: action.locatorTestValue
      };

    case SEARCHING_FOR_ELEMENTS:
      return {
        ...state,
        locatedElements: null,
        locatorTestElement: null,
        isSearchingForElements: true,
      };

    case SEARCHING_FOR_ELEMENTS_COMPLETED:
      return {
        ...state,
        locatedElements: action.elements,
        isSearchingForElements: false,
      };

    case SET_LOCATOR_TEST_ELEMENT:
      return {
        ...state,
        locatorTestElement: action.elementId,
      };

    case CLEAR_SEARCH_RESULTS:
      return {
        ...state,
        locatedElements: null,
      };

    case SET_SCREENSHOT_INTERACTION_MODE:
      return {
        ...state,
        screenshotInteractionMode: action.screenshotInteractionMode,
      };

    case SET_SWIPE_START:
      return {
        ...state,
        swipeStart: {
          x: action.swipeStartX,
          y: action.swipeStartY,
        },
      };

    case SET_SWIPE_END:
      return {
        ...state,
        swipeEnd: {
          x: action.swipeEndX,
          y: action.swipeEndY,
        },
      };

    case CLEAR_SWIPE_ACTION:
      return {
        ...state,
        swipeStart: null,
        swipeEnd: null,
      };

    case SET_SEARCHED_FOR_ELEMENT_BOUNDS:
      return {
        ...state,
        searchedForElementBounds: {
          location: action.location,
          size: action.size,
        }
      };
    
    case CLEAR_SEARCHED_FOR_ELEMENT_BOUNDS:
      return {
        ...state,
        searchedForElementBounds: null,
      };

    case PROMPT_KEEP_ALIVE:
      return {
        ...state,
        showKeepAlivePrompt: true,
      };

    case HIDE_PROMPT_KEEP_ALIVE:
      return {
        ...state,
        showKeepAlivePrompt: false,
      };

    default:
      return {...state};
  }
}
