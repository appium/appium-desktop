export const SET_ENVIRONMENT_VARIABLE = 'SET_ENVIRONMENT_VARIABLE';

export function setEnvironmentVariable (name, value) {
  return (dispatch) => {
    dispatch({type: SET_ENVIRONMENT_VARIABLE, name, value});
  };
}