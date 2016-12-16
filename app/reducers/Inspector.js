import { omit } from 'lodash';

import { SET_SOURCE_AND_SCREENSHOT, QUIT_SESSION_REQUESTED, SESSION_DONE, SELECT_ELEMENT, UNSELECT_ELEMENT, SET_HOVERED_ELEMENT, UNSET_HOVERED_ELEMENT,
  METHOD_CALL_REQUESTED, METHOD_CALL_DONE, SET_FIELD_VALUE, SET_EXPANDED_PATHS } from '../actions/Inspector';

const INITIAL_STATE = {
  expandedPaths: ['0']
};

export default function inspector (state=INITIAL_STATE, action) {
  switch (action.type) {
    case SET_SOURCE_AND_SCREENSHOT:
      return {
        ...state,
        source: action.source,
        screenshot: action.screenshot,
      };

    case QUIT_SESSION_REQUESTED:
      return {
        ...state,
        isQuittingSession: true,
      };
      
    case SESSION_DONE:
      return {
        ...state,
        isSessionDone: true, 
        methodCallInProgress: false,
      };

    case SELECT_ELEMENT:
      var {path} = action;

      // Look up the element that his this path
      var selectedElement = state.source;
      for (let index of path.split('.')) {
        selectedElement = selectedElement.children[index];
      }

      // Set the selectedPath and selectedElement
      return {
        ...state,
        selectedPath: path,
        selectedElement: {...selectedElement},
      };

    case UNSELECT_ELEMENT:
      return omit(state, ['selectedElement', 'selectedPath']);

    case METHOD_CALL_REQUESTED:
      return {
        ...state,
        methodCallInProgress: true,
      };

    case METHOD_CALL_DONE:
      return omit(state, 'methodCallInProgress');

    case SET_FIELD_VALUE:
      return {
        ...state,
        [action.name]: action.value,
      };

    case SET_EXPANDED_PATHS:
      return {
        ...state,
        expandedPaths: action.paths,
      };

    case SET_HOVERED_ELEMENT:
      return {
        ...state,
        hoveredPath: action.path,
      };

    case UNSET_HOVERED_ELEMENT:
      return omit(state, 'hoveredPath');

    default:
      return {...state};
  }
}