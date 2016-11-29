export const UPDATE_DESIRED_CAPABILITIES = 'updateDesiredCapabilities';

export function updateDesiredCapabilities (key, value) {
  return (dispatch) => {
    dispatch({type: UPDATE_DESIRED_CAPABILITIES, key, value});
  };
}