import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { debounce } from 'lodash';
import HighlighterRects from './HighlighterRects';
import { Spin, Tooltip } from 'antd';
import B from 'bluebird';
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
      x: null,
      y: null,
    };
    this.updateScaleRatio = debounce(this.updateScaleRatio.bind(this), 1000);
  }

  /**
   * Calculates the ratio that the image is being scaled by
   */
  updateScaleRatio () {
    const screenshotEl = this.containerEl.querySelector('img');

    // now update scale ratio
    this.setState({
      scaleRatio: (this.props.windowSize.width / screenshotEl.offsetWidth)
    });
  }


  clickScreenshotElement (source, selectedElement, scaleRatio, x, y, highlighterXOffset, highlighterYOffset) {
    const {selectElement, unselectElement} = this.props;
    let thisSelectedElementKey = null;
    let shouldSelectNext = false;
    let newSelect = true;
    let isInElement = (element, x, y) => {
      if (element == null) {
        return false;
      }
      const {x1, y1, x2, y2} = parseCoordinates(element);
      let left = x1 / scaleRatio + highlighterXOffset;
      let top = y1 / scaleRatio + highlighterYOffset;
      let width = (x2 - x1) / scaleRatio;
      let height = (y2 - y1) / scaleRatio;

      if (x > left && x < left + width && y > top && y < top + height) {
        return true;
      }

      return false;
    };

    if (selectedElement != null) {
      if (isInElement(selectedElement, x, y)) {
        newSelect = false;
      }
    }
    let recursive = (element, zIndex = 0) => {
      if (!element) {
        return false;
      }

      let noChildIsInRect = true;
      for (let i = element.children.length - 1 ; i >= 0 ; i--) {
        if (recursive(element.children[i], zIndex + 1)) {
          noChildIsInRect = false;
        }
      }

      if (isInElement(element, x, y)) {
        //If this is leaf element or most child element among rects containing click point
        if (element.children.length === 0 || noChildIsInRect) {
          if (selectedElement == null || newSelect) {
            if (thisSelectedElementKey == null) {
              thisSelectedElementKey = element.path;
            }
          } else {
            if (selectedElement.path === element.path) {
              shouldSelectNext = true;
            } else if (shouldSelectNext) {
              thisSelectedElementKey = element.path;
              shouldSelectNext = false;
            }
          }
        }
        return true;
      } else {
        return false;
      }
    };
    recursive(source);
    if (shouldSelectNext || thisSelectedElementKey == null) {
      unselectElement();
    } else {
      selectElement(thisSelectedElementKey);
    }
  }

  async handleScreenshotClick (e) {
    const {screenshotInteractionMode, applyClientMethod,
           swipeStart, swipeEnd, setSwipeStart, setSwipeEnd, source, selectedElement} = this.props;
    const {x, y, scaleRatio} = this.state;
    /**
     * This is way to select overlapped behind views of Screenshot component
     */
    if (screenshotInteractionMode === 'select') {
      const highlighterXOffset = this.containerEl.getBoundingClientRect().left;
      const highlighterYOffset = this.containerEl.getBoundingClientRect().top;
      this.clickScreenshotElement(source, selectedElement, scaleRatio, e.clientX, e.clientY, highlighterXOffset, highlighterYOffset);
    } else if (screenshotInteractionMode === 'tap') {
      applyClientMethod({
        methodName: 'tap',
        args: [x, y],
      });
    } else if (screenshotInteractionMode === 'swipe') {
      if (!swipeStart) {
        setSwipeStart(x, y);
      } else if (!swipeEnd) {
        setSwipeEnd(x, y);
        await B.delay(500); // Wait a second to do the swipe so user can see the SVG line
        await this.handleDoSwipe();
      }
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
        x: Math.round(x),
        y: Math.round(y),
      });
    }
  }

  handleMouseOut () {
    this.setState({
      ...this.state,
      x: null,
      y: null,
    });
  }

  async handleDoSwipe () {
    const {swipeStart, swipeEnd, clearSwipeAction, applyClientMethod} = this.props;
    await applyClientMethod({
      methodName: 'swipe',
      args: [swipeStart.x, swipeStart.y, swipeEnd.x, swipeEnd.y],
    });
    clearSwipeAction();
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
    const {screenshot, methodCallInProgress, screenshotInteractionMode,
           swipeStart, swipeEnd} = this.props;
    const {scaleRatio, x, y} = this.state;

    // If we're tapping or swiping, show the 'crosshair' cursor style
    const screenshotStyle = {};
    if (screenshotInteractionMode === 'tap' || screenshotInteractionMode === 'swipe') {
      screenshotStyle.cursor = 'crosshair';
    }

    let swipeInstructions = null;
    if (screenshotInteractionMode === 'swipe' && (!swipeStart || !swipeEnd)) {
      if (!swipeStart) {
        swipeInstructions = 'Click swipe start point';
      } else if (!swipeEnd) {
        swipeInstructions = 'Click swipe end point';
      }
    }

    const screenImg = <img src={`data:image/gif;base64,${screenshot}`} id="screenshot" />;

    // Show the screenshot and highlighter rects. Show loading indicator if a method call is in progress.
    return <Spin size='large' spinning={!!methodCallInProgress}>
      <div className={styles.innerScreenshotContainer}>
        <div ref={(containerEl) => { this.containerEl = containerEl; }}
          style={screenshotStyle}
          onClick={this.handleScreenshotClick.bind(this)}
          onMouseMove={this.handleMouseMove.bind(this)}
          onMouseOut={this.handleMouseOut.bind(this)}
          className={styles.screenshotBox}>
          {x !== null && <div className={styles.coordinatesContainer}>
            <p>X: {x}</p>
            <p>Y: {y}</p>
          </div>}
          {swipeInstructions && <Tooltip visible={true} placement="top" title={swipeInstructions}>{screenImg}</Tooltip>}
          {!swipeInstructions && screenImg}
          {screenshotInteractionMode === 'select' && this.containerEl && <HighlighterRects {...this.props} containerEl={this.containerEl} />}
          {screenshotInteractionMode === 'swipe' &&
            <svg className={styles.swipeSvg}>
              {swipeStart && !swipeEnd && <circle
                cx={swipeStart.x / scaleRatio}
                cy={swipeStart.y / scaleRatio}
              />}
              {swipeStart && swipeEnd && <line
                x1={swipeStart.x / scaleRatio}
                y1={swipeStart.y / scaleRatio}
                x2={swipeEnd.x / scaleRatio}
                y2={swipeEnd.y / scaleRatio}
              />}
            </svg>
          }
        </div>
      </div>
    </Spin>;
  }
}
