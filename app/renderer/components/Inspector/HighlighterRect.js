import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import InspectorCSS from './Inspector.css';
import { parseCoordinates } from './shared';

/**
 * Absolute positioned divs that overlay the app screenshot and highlight the bounding
 * boxes of the elements in the app
 */
export default class HighlighterRect extends Component {

  render () {
    const {selectedElement = {}, selectHoveredElement, unselectHoveredElement, hoveredElement = {}, selectElement, unselectElement, element, zIndex, scaleRatio, xOffset} = this.props;
    const {path: hoveredPath} = hoveredElement;
    const {path: selectedPath} = selectedElement;

    // Calculate left, top, width and height coordinates
    const {x1, y1, x2, y2} = parseCoordinates(element);
    const left = x1 / scaleRatio + xOffset;
    const top = y1 / scaleRatio;
    const width = (x2 - x1) / scaleRatio;
    const height = (y2 - y1) / scaleRatio;

    // Add class + special classes to hovered and selected elements
    const highlighterClasses = [InspectorCSS['highlighter-box']];
    if (hoveredPath === element.path) {
      highlighterClasses.push(InspectorCSS['hovered-element-box']);
    }
    if (selectedPath === element.path) {
      highlighterClasses.push(InspectorCSS['inspected-element-box']);
    }

    return <div className={highlighterClasses.join(' ').trim()}
      onMouseOver={() => selectHoveredElement(element.path)}
      onMouseOut={unselectHoveredElement}
      onClick={() => element.path === selectedPath ? unselectElement() : selectElement(element.path)}
      key={element.path}
      style={{zIndex, left: (left || 0), top: (top || 0), width: (width || 0), height: (height || 0)}}>
      <div></div>
    </div>;
  }
}
