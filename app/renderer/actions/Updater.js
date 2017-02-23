export const UPDATE_INFO = 'UPDATE_INFO';

export function foundAvailableUpdate (updateInfo) {
  return (dispatch) => {
    dispatch({type: UPDATE_INFO, updateInfo});
  };
}