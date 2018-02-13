import { ServerTypes, CHANGE_SERVER_TYPE, SWITCHED_TABS } from '../actions/Session';
import { SET_SAVED_TESTS } from '../actions/Inspector';

import { NEW_PLAYBACK_SESSION_REQUESTED, NEW_PLAYBACK_SESSION_BEGAN,
  NEW_PLAYBACK_SESSION_DONE, CHANGE_TEST, DELETE_SAVED_TEST_REQUESTED,
  DELETE_SAVED_TEST_DONE, PLAYBACK_LOADING, PLAYBACK_LOADING_DONE
} from '../actions/PlaybackLibrary';

const INITIAL_STATE = {
  savedTests: [],
  testResults: [],
  tabKey: 'tests',
  serverType: ServerTypes.local,
  playbackLoading: false,
  playbackSessionBegan: false,
  deletingTest: null,
};

export default function playbackLibrary (state = INITIAL_STATE, action) {
  switch (action.type) {
    case CHANGE_SERVER_TYPE:
      return {...state, serverType: action.serverType};

    case SWITCHED_TABS:
      return {...state, tabKey: action.key};

    case NEW_PLAYBACK_SESSION_REQUESTED:
      break;
    case NEW_PLAYBACK_SESSION_BEGAN:
      return {...state, playbackSessionBegan: true};

    case NEW_PLAYBACK_SESSION_DONE:
      return {...state, playbackSessionBegan: false};

    case SET_SAVED_TESTS:
      return {...state, savedTests: action.tests};

    case CHANGE_TEST:
      break;
    case DELETE_SAVED_TEST_REQUESTED:
      return {...state, deletingTest: action.name};

    case DELETE_SAVED_TEST_DONE:
      return {...state, deletingTest: null};

    case PLAYBACK_LOADING:
      return {...state, playbackLoading: true};

    case PLAYBACK_LOADING_DONE:
      return {...state, playbackLoading: false};

    default:
      break;
  }

  return {...state};
}
