export const SERVER_START_REQ = 'SERVER_START_REQ';
export const SERVER_START_OK = 'SERVER_START_OK';
export const SERVER_START_FAIL = 'SERVER_START_FAIL';

export function startServerReq () {
  return {type: SERVER_START_REQ};
}

export function startServerOK () {
  return {type: SERVER_START_OK};
}

export function startServerFailed () {
  return {type: SERVER_START_FAIL};
}

export function startServer (/*host, port*/) {
  return (dispatch) => {
    dispatch(startServerReq());
    //do something with host and port
    //actually start here
  };
}
