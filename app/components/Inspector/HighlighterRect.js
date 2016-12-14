import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import InspectorCSS from '../Inspector.css';

export default class HighlighterRect extends Component {

  render () {
    const highlighterRects = [];
    const {selectedPath, setHoveredElement, unsetHoveredElement, hoveredPath, selectElement, node, zIndex, scaleRatio} = this.props;

    let {bounds} = node.attributes || {};
    if (bounds) {
      // Parse the bounds from string to array
      bounds = bounds.split(/\[|\]|,/).filter((str) => str !== '');

      // Calculate style (coordinates, backgroundColor, etc...)
      let left = bounds[0] / scaleRatio;
      let top = bounds[1] / scaleRatio;
      let width = (bounds[2] - bounds[0]) / scaleRatio;
      let height = (bounds[3] - bounds[1]) / scaleRatio;

      let highlighterClasses = [InspectorCSS['highlighter-box']];
      hoveredPath === node.path && highlighterClasses.push(InspectorCSS['hovered-element-box']);
      selectedPath === node.path && highlighterClasses.push(InspectorCSS['inspected-element-box']);

      highlighterRects.push();

      return <div className={highlighterClasses.join(' ')} 
        onMouseOver={() => setHoveredElement(node.path)}
        onMouseOut={unsetHoveredElement} 
        onClick={() => selectElement(node.path)}
        key={node.path}
        style={{zIndex, left, top, width, height}}>
        <div></div>
      </div>;

    } else {
      return null;
    }
  }
}
