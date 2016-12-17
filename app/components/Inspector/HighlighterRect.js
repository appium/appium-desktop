import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import InspectorCSS from '../Inspector.css';

/**
 * Absolute positioned divs that overlay the app screenshot and highlight the bounding
 * boxes of the elements in the app
 */
export default class HighlighterRect extends Component {

  render () {
    const {selectedElement = {}, selectHoveredElement, unselectHoveredElement, hoveredElement = {}, selectElement, unselectElement, node, zIndex, scaleRatio} = this.props;
    const {path: hoveredPath} = hoveredElement;
    const {path: selectedPath} = selectedElement;

    let {bounds, x, y, width, height} = node.attributes || {};

    let x1, y1, x2, y2;

    if (bounds) {
      [x1, y1, x2, y2] = bounds.split(/\[|\]|,/).filter((str) => str !== '');
    } else if (x) {
      x = parseInt(x);
      y = parseInt(y);
      width = parseInt(width);
      height = parseInt(height);
      [x1, y1, x2, y2] = [x, y, x + width, y + height];
    } else {
      return null;
    } 

    // Calculate left, top, width and height coordinates
    let left = x1 / scaleRatio;
    let top = y1 / scaleRatio;
    width = (x2 - x1) / scaleRatio;
    height = (y2 - y1) / scaleRatio;

    // Add class + special classes to hovered and selected elements
    let highlighterClasses = [InspectorCSS['highlighter-box']];
    hoveredPath === node.path && highlighterClasses.push(InspectorCSS['hovered-element-box']);
    selectedPath === node.path && highlighterClasses.push(InspectorCSS['inspected-element-box']);

    return <div className={highlighterClasses.join(' ').trim()} 
      onMouseOver={() => selectHoveredElement(node.path)}
      onMouseOut={unselectHoveredElement} 
      onClick={() => node.path === selectedPath ? unselectElement() : selectElement(node.path)}
      key={node.path}
      style={{zIndex, left, top, width, height}}>
      <div></div>
    </div>;
  }
}
