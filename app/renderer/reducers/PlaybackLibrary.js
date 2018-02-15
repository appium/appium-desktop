import { ServerTypes, CHANGE_SERVER_TYPE, SWITCHED_TABS } from '../actions/Session';
import { SET_SAVED_TESTS } from '../actions/Inspector';

import { NEW_PLAYBACK_SESSION_REQUESTED, NEW_PLAYBACK_SESSION_BEGAN,
  NEW_PLAYBACK_SESSION_DONE, CHANGE_TEST, DELETE_SAVED_TEST_REQUESTED,
  DELETE_SAVED_TEST_DONE, PLAYBACK_LOADING, PLAYBACK_LOADING_DONE,
  SHOW_CAPS_MODAL, HIDE_CAPS_MODAL, TEST_RUNNING, HIDE_TESTRUN_MODAL, TEST_COMPLETE,
  TEST_ACTION_UPDATED, SHOW_TESTRUN_MODAL, TEST_RUN_REQUESTED,
} from '../actions/PlaybackLibrary';

const INITIAL_STATE = {
  savedTests: [],
  testResults: [],
  tabKey: 'tests',
  serverType: ServerTypes.local,
  deletingTest: null,
  capsModal: null,
  testToRun: null,
  testResultToShow: null,
  isTestRunning: false,
  actionsStatus: [],
};

export default function playbackLibrary (state = INITIAL_STATE, action) {
  switch (action.type) {
    case CHANGE_SERVER_TYPE:
      return {...state, serverType: action.serverType};

    case SWITCHED_TABS:
      return {...state, tabKey: action.key};

    case SET_SAVED_TESTS:
      return {...state, savedTests: action.tests};

    case CHANGE_TEST:
      break;
    case DELETE_SAVED_TEST_REQUESTED:
      return {...state, deletingTest: action.name};

    case DELETE_SAVED_TEST_DONE:
      return {...state, deletingTest: null};

    case SHOW_CAPS_MODAL:
      return {...state, capsModal: action.name};

    case HIDE_CAPS_MODAL:
      return {...state, capsModal: null};

    case TEST_ACTION_UPDATED:
      return {...state, actionsStatus: action.actions};

    case TEST_RUN_REQUESTED:
      return {...state, testToRun: action.name, actionsStatus: []};

    case TEST_RUNNING:
      return {...state, isTestRunning: true};

    case TEST_COMPLETE:
      return {
        ...state,
        testResults: [...state.testResults, action.result],
        isTestRunning: false
      };

    case HIDE_TESTRUN_MODAL:
      return {...state, testToRun: null, testResultToShow: null, actionsStatus: []};

    default:
      break;
  }

  return {...state};
}
