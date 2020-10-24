export const SET_UPDATE_STATE = 'SET_UPDATE_STATE';

export function setUpdateState (updateState) {
  return (dispatch) => {
    dispatch({type: SET_UPDATE_STATE, updateState});
  };
}
