import React, { Component } from 'react';
import InspectorCSS from './Inspector.css';
import { parseCoordinates } from './shared';

/**
 * Absolute positioned divs that overlay the app screenshot and highlight the bounding
 * boxes of the elements in the app
 */
export default class HighlighterRect extends Component {

  render () {
    const {selectedElement = {}, selectHoveredElement, unselectHoveredElement, hoveredElement = {}, selectElement, unselectElement, element,
           zIndex, scaleRatio, xOffset, elLocation, elSize} = this.props;
    const {path: hoveredPath} = hoveredElement;
    const {path: selectedPath} = selectedElement;

    let width, height, left, top, highlighterClasses, key;
    highlighterClasses = [InspectorCSS['highlighter-box']];

    if (element) {
      // Calculate left, top, width and height coordinates
      const {x1, y1, x2, y2} = parseCoordinates(element);
      left = x1 / scaleRatio + xOffset;
      top = y1 / scaleRatio;
      width = (x2 - x1) / scaleRatio;
      height = (y2 - y1) / scaleRatio;

      // Add class + special classes to hovered and selected elements
      if (hoveredPath === element.path) {
        highlighterClasses.push(InspectorCSS['hovered-element-box']);
      }
      if (selectedPath === element.path) {
        highlighterClasses.push(InspectorCSS['inspected-element-box']);
      }
      key = element.path;
    } else if (elLocation && elSize) {
      width = elSize.width / scaleRatio;
      height = elSize.height / scaleRatio;
      top = elLocation.y / scaleRatio;
      left = elLocation.x / scaleRatio + xOffset;
      key = 'searchedForElement';
      highlighterClasses.push(InspectorCSS['inspected-element-box']);
    }

    return <div className={highlighterClasses.join(' ').trim()}
      onMouseOver={() => selectHoveredElement(key)}
      onMouseOut={unselectHoveredElement}
      onClick={() => key === selectedPath ? unselectElement() : selectElement(key)}
      key={key}
      style={{zIndex, left: (left || 0), top: (top || 0), width: (width || 0), height: (height || 0)}}>
      <div></div>
    </div>;
  }
}
