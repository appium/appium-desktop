import { 
  NAME_OF_ACTION_1, NAME_OF_ACTION_2
} from '../actions/Stub';


const INITIAL_STATE = {
  someVariable: false,
  someOtherVariable: 'hello',
};

export default function inspector (state=INITIAL_STATE, action) {
  switch (action.type) {
    case NAME_OF_ACTION_1:
      return {
        ...state,
        someVariable: true
      };

    case NAME_OF_ACTION_2:
      return {
        ...state,
        someOtherVariable: 'world',
      };

    default:
      return {...state};
  }
}
