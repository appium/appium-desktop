import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { debounce } from 'lodash';

export default class Screenshot extends Component {

  constructor (props) {
    super(props);
    this.state = {
      scaleRatio: 1
    };
    this.updateScaleRatio = debounce(this.updateScaleRatio.bind(this), 1000);
  }

  updateScaleRatio () {
    let screenshotEl = this.containerEl.querySelector('img');
    this.setState({
      scaleRatio: screenshotEl.naturalHeight / screenshotEl.offsetHeight
    });
  }

  componentDidMount () {
    this.updateScaleRatio();
    window.addEventListener('resize', this.updateScaleRatio);
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.updateScaleRatio);
  }

  render () {
    const highlighterRects = [];
    const {selectedPath, source, setHoveredElement, unsetHoveredElement, hoveredPath, selectElement, screenshot} = this.props;
    const {scaleRatio} = this.state;

    let recursive = (node, zIndex = 0) => {
      if (!node) return;

      let {bounds} = node.attributes || {};
      if (bounds) {
        // Parse the bounds from string to array
        bounds = bounds.split(/\[|\]|,/).filter((str) => str !== '');

        // Calculate style (coordinates, backgroundColor, etc...)
        let left = bounds[0] / scaleRatio;
        let top = bounds[1] / scaleRatio;
        let width = (bounds[2] - bounds[0]) / scaleRatio;
        let height = (bounds[3] - bounds[1]) / scaleRatio;
        let backgroundColor = hoveredPath === node.path ? 'yellow' : (selectedPath === node.path ? 'blue' : '');
        let visibility = (selectedPath === node.path || hoveredPath === node.path) ? '' : 'hidden';
        let position = 'absolute';
        let cursor = 'pointer';
        let opacity = 0.5;

        let containerStyle = {zIndex, left, top, width, height, opacity, position, cursor};
        let style = {backgroundColor, position: 'relative', width: '100%', height: '100%', visibility};

        highlighterRects.push(<div onMouseOver={() => setHoveredElement(node.path)}
          onMouseOut={unsetHoveredElement} 
          onClick={() => selectElement(node.path)}
          style={containerStyle}>
          <div style={style}></div>
        </div>);
      }

      node.children.forEach((childNode) => recursive(childNode, zIndex + 1));
    };

    recursive(source);
    return <div ref={(containerEl) => this.containerEl = containerEl}>
        <img id='appium-screenshot' style={{width: '100%'}} src={`data:image/gif;base64,${screenshot}`} />}
        {highlighterRects}
    </div>;
  }
}
