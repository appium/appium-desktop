import { ServerTypes, CHANGE_SERVER_TYPE } from '../actions/Session';
import { NEW_PLAYBACK_SESSION_REQUESTED, NEW_PLAYBACK_SESSION_BEGAN,
  NEW_PLAYBACK_SESSION_DONE, CHANGE_TEST, GET_SAVED_TESTS_REQUESTED,
  GET_SAVED_TESTS_DONE, DELETE_SAVED_TEST_REQUESTED, DELETE_SAVED_TEST_DONE,
  PLAYBACK_LOADING, PLAYBACK_LOADING_DONE
} from '../actions/PlaybackLibrary';

const INITIAL_STATE = {
  savedTests: [],
  testRunHistory: [],
  tabKey: 'new',
  serverType: ServerTypes.local,
  playbackLoading: false,
};

export default function playbackLibrary (state = INITIAL_STATE, action) {
  switch (action.type) {
    case CHANGE_SERVER_TYPE:
      return {...state, serverType: action.serverType};

    case NEW_PLAYBACK_SESSION_REQUESTED:
      break;
    case NEW_PLAYBACK_SESSION_BEGAN:
      break;
    case NEW_PLAYBACK_SESSION_DONE:
      break;
    case CHANGE_TEST:
      break;
    case GET_SAVED_TESTS_REQUESTED:
      break;
    case GET_SAVED_TESTS_DONE:
      break;
    case DELETE_SAVED_TEST_REQUESTED:
      break;
    case DELETE_SAVED_TEST_DONE:
      break;
    case PLAYBACK_LOADING:
      return {...state, playbackLoading: true};

    case PLAYBACK_LOADING_DONE:
      return {...state, playbackLoading: false};

    default:
      break;
  }

  return {...state};
}
