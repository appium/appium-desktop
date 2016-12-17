export function parseCoordinates (element) {
  let {bounds, x, y, width, height} = element.attributes || {};

  if (bounds) {
    let boundsArray = bounds.split(/\[|\]|,/).filter((str) => str !== '');
    return {x1: boundsArray[0], y1: boundsArray[1], x2: boundsArray[2], y2: boundsArray[3]};
  } else if (x) {
    x = parseInt(x);
    y = parseInt(y);
    width = parseInt(width);
    height = parseInt(height);
    return {x1: x, y1: y, x2: x + width, y2: y + height};
  } else { 
    return {};
  } 
}