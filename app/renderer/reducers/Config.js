import { 
  SET_ENVIRONMENT_VARIABLE, SET_ENVIRONMENT_VARIABLES
} from '../actions/Config';


const INITIAL_STATE = {
  environmentVariables: {},
  defaultEnvironmentVariables: {},
};

export default function inspector (state=INITIAL_STATE, action) {
  switch (action.type) {
    case SET_ENVIRONMENT_VARIABLE:
      return {
        ...state,
        environmentVariables: {
          ...state.environmentVariables,
          [action.name]: action.value,
        }
      };

    case SET_ENVIRONMENT_VARIABLES:
      return {
        ...state,
        environmentVariables: action.savedEnvironmentVariables,
        defaultEnvironmentVariables: action.defaultEnvironmentVariables,
      };

    default:
      return {...state};
  }
}
