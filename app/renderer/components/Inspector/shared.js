import _ from 'lodash';

export function parseCoordinates (element) {
  let {bounds, x, y, width, height} = element.attributes || {};

  if (bounds) {
    let boundsArray = bounds.split(/\[|\]|,/).filter((str) => str !== '');
    return {x1: boundsArray[0], y1: boundsArray[1], x2: boundsArray[2], y2: boundsArray[3]};
  } else if (x) {
    x = parseInt(x, 10);
    y = parseInt(y, 10);
    width = parseInt(width, 10);
    height = parseInt(height, 10);
    return {x1: x, y1: y, x2: x + width, y2: y + height};
  } else { 
    return {};
  } 
}

// Map of the optimal strategies. 
const STRATEGY_MAPPINGS = [
  ['name', 'accessibility id'],
  ["content-desc", 'accessibility id'],
  ['id', 'id'],
  ["resource-id", 'id'],
];

export function getLocators (attributes) {
  const res = {};
  for (let [strategyAlias, strategy] of STRATEGY_MAPPINGS) {
    if (attributes[strategyAlias]) {
      res[strategy] = attributes[strategyAlias];
    }
  }
  return res;
}