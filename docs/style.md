# Style Guidelines

(This is a work in progress)

## Writing Redux Reducers

* Always define an `initialState` variable

* Always extend the state and never overwrite it

```javascript
// good 
export default function session (state = initialState, action) {
  switch (action.type) {
    case CASE_NAME:
      return {...state, item1: action.item1, item2: action.item2};
    default:
      return {...state};
  }
}

// bad
export default function session (state = initialState, action) {
  switch (action.type) {
    case CASE_NAME:
      return {item1: action.item1, item2: action.item2}; // Do not overwrite the entire state
    default:
      return {...state};
  }
}
```

* The initial state should define every property up front (properties shouldn't be introduced to the state by a future action) and each property should always be scrictly typed

```javascript
// good
const initialState = {
  flag: false, // boolean
  str: '', // string
  arr: [],  // array
};

export default function session (state = initialState, action) {
  switch (action.type) {
    case CASE_NAME_1:
      return {...state, flag: !!action.flag};
    case CASE_NAME_2:
      return {...state, str: action.str || ''};
    case CASE_NAME_3:
      return {...state, arr: Object.assign([], action.arr)};
    default:
      return {...state};
  }
}

// bad
const initialState = {
  str: '', // string
  arr: [],  // array
};

export default function session (state = v, action) {
  switch (action.type) {
    case CASE_NAME_1:
      return {...state, flag: !!action.flag}; // 'flag' should be defined in initial state
    case CASE_NAME_2:
      return {...state, str: action.str}; // What if action.str is not a string?
    case CASE_NAME_3:
      return {...state, arr: action.arr}; // What if action.arr is not an array?
    default:
      return {...state}
  }
}
```

* Objects should always be updated via the spread `...` notation (unless the case specifically requires the object to be overwritten). If an object is incorrectly overwritten, we risk having undefined references.

```javascript

// good
const initialState = {
  server: {
    local: {},
    remote: {},
    sauce: {},
    testobject: {},
  }
};

export default function session (state = INITIAL_STATE, action) {
  switch (action.type) {
    case CASE_NAME:
      return {
        ...state,
        server: {
          ...state.server,
          ...action.server,
        },
      };
    default:
      return {...state};
  }
}

// bad
const initialState = {
  server: {
    local: {},
    remote: {},
    sauce: {},
    testobject: {},
  }
};

export default function session (state = INITIAL_STATE, action) {
  switch (action.type) {
    case CASE_NAME:
      return {
        ...state,
        server: {
          local: action.local,
          remote: action.remote,
          sauce: action.sauce,
          testobject: action.testobject, 
        }, // What if a 5th property is added? It will be overwritten by this case.
      };
    default:
      return {...state};
  }
}
```





