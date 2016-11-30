import { push } from 'react-router-redux';

export const NEW_SESSION_REQUESTED = 'newSessionRequested';

export function newSessionRequested (desiredCapabilities) {
  return {type: NEW_SESSION_REQUESTED, desiredCapabilities};
}

export function newSession (desiredCapabilities) {
  return (dispatch) => {
    dispatch(newSessionRequested(desiredCapabilities));
    dispatch(push('/inspector'));
  };
}