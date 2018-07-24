import { 
  SET_ENVIRONMENT_VARIABLE
} from '../actions/Config';


const INITIAL_STATE = {
  environmentVariables: {},
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

    default:
      return {...state};
  }
}
