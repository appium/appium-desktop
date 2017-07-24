import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { debounce } from 'lodash';
import HighlighterRect from './HighlighterRect';
import Actions from './Actions';
import { Spin } from 'antd';
import styles from './Inspector.css';
import { parseCoordinates } from './shared';

/**
 * Shows screenshot of running application and divs that highlight the elements' bounding boxes
 */
export default class Screenshot extends Component {

  constructor (props) {
    super(props);
    this.containerEl = null;
    this.state = {
      scaleRatio: 1,
    };
    this.updateScaleRatio = debounce(this.updateScaleRatio.bind(this), 1000);
  }

  /**
   * Calculates the ratio that the image is being scaled by
   */
  updateScaleRatio () {
    const screenshotEl = this.containerEl.querySelector('img');

    // now update scale ratio
    const {x1, x2} = parseCoordinates(this.props.source.children[0].children[0]);
    this.setState({
      scaleRatio: (x2 - x1) / screenshotEl.offsetWidth
    });

  }

  handleScreenshotClick () {
    const {screenshotInteractionMode, applyClientMethod} = this.props;
    const {x, y} = this.state;

    if (screenshotInteractionMode === 'tap') {
      applyClientMethod({
        methodName: 'tap',
        args: [x, y],
      });
    }
  }

  handleMouseMove (e) {
    const {screenshotInteractionMode} = this.props;
    const {scaleRatio} = this.state;

    if (screenshotInteractionMode !== 'select') {
      const offsetX = e.nativeEvent.offsetX;
      const offsetY = e.nativeEvent.offsetY;
      const x = offsetX * scaleRatio;
      const y = offsetY * scaleRatio;
      this.setState({
        ...this.state,
        x,
        y,
      });
    }
  }

  handleMouseOut () {
    this.setState({
      ...this.state,
      x: undefined,
      y: undefined,
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
    const {source, screenshot, methodCallInProgress, screenshotInteractionMode} = this.props;
    const {scaleRatio} = this.state;

    // Recurse through the 'source' JSON and render a highlighter rect for each element
    const highlighterRects = [];

    let highlighterXOffset = 0;
    if (this.containerEl) {
      const screenshotEl = this.containerEl.querySelector('img');
      highlighterXOffset = screenshotEl.getBoundingClientRect().left -
                           this.containerEl.getBoundingClientRect().left;
    }

    // TODO: Refactor this into a separate component
    let recursive = (element, zIndex = 0) => {
      if (!element) {
        return;
      }
      highlighterRects.push(<HighlighterRect {...this.props}
        element={element}
        zIndex={zIndex}
        scaleRatio={scaleRatio}
        key={element.path}
        xOffset={highlighterXOffset}
      />);

      for (let childEl of element.children) {
        recursive(childEl, zIndex + 1);
      }
    };

    // If we're tapping or swiping, show the 'touch' cursor style
    const screenshotStyle = {};
    if (screenshotInteractionMode === 'tap' || screenshotInteractionMode === 'swipe') {
      screenshotStyle.cursor = 'crosshair'; // TODO: Change this to touch
    }

    recursive(source);

    // Show the screenshot and highlighter rects. Show loading indicator if a method call is in progress.
    return <Spin size='large' spinning={!!methodCallInProgress}>
      <Actions {...this.props} />
      <div ref={(containerEl) => { this.containerEl = containerEl; }}
        style={screenshotStyle} 
        onClick={this.handleScreenshotClick.bind(this)}
        onMouseMove={this.handleMouseMove.bind(this)}
        onMouseOut={this.handleMouseOut.bind(this)}
        className={styles.screenshotBox}>
        <img src={`data:image/gif;base64,${screenshot}`} id="screenshot" />
        {screenshotInteractionMode === 'select' && highlighterRects}
      </div>
    </Spin>;
  }
}
