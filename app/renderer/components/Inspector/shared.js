import { DOMParser } from 'xmldom';
import xpath from 'xpath';

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

export function isUnique (attrName, attrValue, sourceXML) {
  // If no sourceXML provided, assume it's unique
  if (!sourceXML) {
    return true;
  }
  const doc = new DOMParser().parseFromString(sourceXML);
  return xpath.select(`//*[@${attrName}="${attrValue}"]`, doc).length < 2;
}

// Map of the optimal strategies. 
const STRATEGY_MAPPINGS = [
  ['name', 'accessibility id'],
  ['content-desc', 'accessibility id'],
  ['id', 'id'],
  ['resource-id', 'id'],
];

export function getLocators (attributes, sourceXML) {
  const res = {};
  for (let [strategyAlias, strategy] of STRATEGY_MAPPINGS) {
    const value = attributes[strategyAlias];
    if (value && isUnique(strategyAlias, value, sourceXML)) {
      res[strategy] = attributes[strategyAlias];
    }
  }
  return res;
}