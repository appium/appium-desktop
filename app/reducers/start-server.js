import { SERVER_START_REQ, SERVER_START_OK,
         SERVER_START_FAIL, UPDATE_ADDRESS,
         UPDATE_PORT} from '../actions/start-server';

// TODO get these from appium package itself!
const DEFAULT_ADDRESS = "0.0.0.0";
const DEFAULT_PORT = 4723;

const initialState = {
  port: DEFAULT_PORT,
  address: DEFAULT_ADDRESS,
  serverStarting: false,
  serverFailMsg: ""
};

export default function startServer (state = initialState, action) {
  switch (action.type) {
    case SERVER_START_REQ:
      return {...state, serverStarting: true};
    case SERVER_START_OK:
      return {
        ...state,
        serverStarting: false,
      };
    case SERVER_START_FAIL:
      return {
        ...state,
        serverStarting: false,
        serverFailMsg: action.reason
      };
    case UPDATE_ADDRESS:
      return {
        ...state,
        address: action.address
      };
    case UPDATE_PORT:
      return {
        ...state,
        port: action.port
      };
    default:
      return state;
  }
}
