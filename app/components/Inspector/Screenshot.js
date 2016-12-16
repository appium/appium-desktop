import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { debounce } from 'lodash';
import HighlighterRect from './HighlighterRect';
import { Spin } from 'antd';


/**
 * Shows screenshot of running application and divs that highlight the elements' bounding boxes
 */
export default class Screenshot extends Component {

  constructor (props) {
    super(props);
    this.state = {
      scaleRatio: 1
    };
    this.updateScaleRatio = debounce(this.updateScaleRatio.bind(this), 1000);
  }

  /**
   * Calculates the ratio that the image is being scaled by
   */
  updateScaleRatio () {
    let screenshotEl = this.containerEl.querySelector('img');
    this.setState({
      scaleRatio: screenshotEl.naturalHeight / screenshotEl.offsetHeight
    });
  }

  componentDidMount () {
    // When DOM is ready, calculate the image scale ratio and re-calculate it whenever the window is resized
    this.updateScaleRatio();
    window.addEventListener('resize', this.updateScaleRatio);
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.updateScaleRatio);
  }

  render () {
    const {source, screenshot, methodCallInProgress} = this.props;
    const {scaleRatio} = this.state;

    // Recurse through the 'source' JSON and render a highlighter rect for each element
    const highlighterRects = [];

    let recursive = (node, zIndex = 0) => {
      if (!node) return;
      highlighterRects.push(<HighlighterRect {...this.props} 
        node={node} 
        zIndex={zIndex} 
        scaleRatio={scaleRatio} 
        key={node.path} 
      />);
      node.children.forEach((childNode) => recursive(childNode, zIndex + 1));
    };

    recursive(source);

    // Show the screenshot and highlighter rects. Show loading indicator if a method call is in progress.
    return <Spin size='large' spinning={!!methodCallInProgress}>
      <div ref={(containerEl) => this.containerEl = containerEl}>
        <img src={`data:image/gif;base64,${screenshot}`} />
        {highlighterRects}
      </div>
    </Spin>;
  }
}
