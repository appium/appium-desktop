import { ServerTypes, CHANGE_SERVER_TYPE, SWITCHED_TABS } from '../actions/Session';
import { SET_SAVED_TESTS } from '../actions/Inspector';

import { CHANGE_TEST, DELETE_SAVED_TEST_REQUESTED, DELETE_SAVED_TEST_DONE,
  SHOW_CAPS_MODAL, HIDE_CAPS_MODAL, TEST_RUNNING, HIDE_TESTRUN_MODAL,
  TEST_COMPLETE, TEST_ACTION_UPDATED, TEST_RUN_REQUESTED, SET_TEST_RESULTS,
  SHOW_RESULT,
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
      return {...state, deletingTest: action.id};

    case DELETE_SAVED_TEST_DONE:
      return {...state, deletingTest: null};

    case SHOW_CAPS_MODAL:
      return {...state, capsModal: action.id};

    case HIDE_CAPS_MODAL:
      return {...state, capsModal: null};

    case TEST_ACTION_UPDATED:
      return {...state, actionsStatus: action.actions};

    case TEST_RUN_REQUESTED:
      return {...state, testToRun: action.id, actionsStatus: []};

    case TEST_RUNNING:
      return {...state, isTestRunning: true};

    case TEST_COMPLETE:
      return {...state, isTestRunning: false};

    case HIDE_TESTRUN_MODAL:
      return {...state, testToRun: null, testResultToShow: null, actionsStatus: []};

    case SET_TEST_RESULTS:
      return {...state, testResults: action.results};

    case SHOW_RESULT:
      return {...state, testResultToShow: action.id};

    default:
      break;
  }

  return {...state};
}
