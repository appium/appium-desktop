import { ACTION_STATE_PENDING, ACTION_STATE_IN_PROGRESS, ACTION_STATE_COMPLETE,
  ACTION_STATE_ERRORED, ACTION_STATE_CANCELED, getTestResult, getTest } from '../../actions/PlaybackLibrary';

export function iconForState (state) {
  const iconMap = {
    [ACTION_STATE_PENDING]: 'ellipsis',
    [ACTION_STATE_IN_PROGRESS]: 'loading',
    [ACTION_STATE_COMPLETE]: 'check-circle-o',
    [ACTION_STATE_ERRORED]: 'exclamation-circle-o',
    [ACTION_STATE_CANCELED]: 'close',
  };
  const icon = iconMap[state];
  const colorMap = {
    [ACTION_STATE_PENDING]: '#ccc',
    [ACTION_STATE_IN_PROGRESS]: '#666',
    [ACTION_STATE_COMPLETE]: 'green',
    [ACTION_STATE_ERRORED]: '#ca6666',
    [ACTION_STATE_CANCELED]: '#888668',
  };
  const color = colorMap[state];
  if (!icon) {
    throw new Error(`No icon for state ${state}`);
  }
  return {icon, color};
}

export function stateDataForTest (actions) {
  const allStates = actions.map((action) => action.state);

  if (allStates.indexOf(ACTION_STATE_ERRORED) !== -1) {
    return {
      ...iconForState(ACTION_STATE_ERRORED),
      text: 'Failed',
      className: 'failed',
    };
  }

  if (allStates.indexOf(ACTION_STATE_CANCELED) !== -1) {
    return {
      ...iconForState(ACTION_STATE_CANCELED),
      text: 'Canceled',
      className: 'canceled'
    };
  }

  if (allStates.indexOf(ACTION_STATE_PENDING) !== -1 ||
      allStates.indexOf(ACTION_STATE_IN_PROGRESS) !== -1) {
    return {
      ...iconForState(ACTION_STATE_IN_PROGRESS),
      text: 'In Progress',
      className: 'inProgress'
    };
  }

  return {
    ...iconForState(ACTION_STATE_COMPLETE),
    text: 'Passed',
    className: 'passed'
  };
}

export function sortedTests (savedTests) {
  return sortedByDate(savedTests, 'recordedAt');
}

export function sortedResults (testResults) {
  return sortedByDate(testResults, 'date');
}

function sortedByDate (items, dateKey) {
  const itemsCopy = [...items];
  itemsCopy.sort((a, b) => {
    return b[dateKey] - a[dateKey];
  });
  return itemsCopy;
}

export { getTest, getTestResult};
