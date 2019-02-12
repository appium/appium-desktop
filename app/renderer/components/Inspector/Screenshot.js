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

  /**
   * Find, switch proper element for element-selection
   * @param {*} x User clicked point X
   * @param {*} y User clicked point Y
   */
  clickScreenshotElement (x, y) {
    const {selectElement, unselectElement, source, selectedElement} = this.props;
    const {scaleRatio} = this.state;
    const {left: highlighterXOffset, top: highlighterYOffset} = this.containerEl.getBoundingClientRect();
    let thisSelectedElementKey = null;
    let shouldSelectNext = false;
    let newSelect = true;
    let isCoordinatesInElement = (element, x, y) => {
      if (element == null) {
        return false;
      }
      const {x1, y1, x2, y2} = parseCoordinates(element);
      const left = x1 / scaleRatio + highlighterXOffset;
      const top = y1 / scaleRatio + highlighterYOffset;
      const width = (x2 - x1) / scaleRatio;
      const height = (y2 - y1) / scaleRatio;
      return x > left && x < (left + width) && y > top && y < (top + height);
    };

    if (selectedElement != null && isCoordinatesInElement(selectedElement, x, y)) {
      newSelect = false;
    }

    /**
     * Parsing tree node, find elements corresponding by user click.
     * Corresponding element by user click is 'Candidate element'.
     * Candidate element should be normally most child node containing click point.
     * But candidate element also can be parents node that has child node of not containg click point.
     * In case that parents node is wider then children.
     * Consequently, candidate element can be several.
     *
     * There is 'Selection Order' among candidate elements.
     * Whenever user clicks same point, selected node is changed by selection order.
     *
     * This function set following two values.
     * 1. shouldSelectNext - True if it is last of Selection Order. By this value, next candidate node know it's my turn. Also, By this value, next operation is decided to unselection.
     * 2. thisSelectedElementKey - Element path of candidate element which should be selected at this turn.
     *
     * @param {*} element each of screen shot element
     */
    let recursive = (element) => {
      if (!element) {
        return false;
      }
      let noChildElementIsInRect = true;
      for (let childElement of element.children) {
        if (recursive(childElement)) {
          noChildElementIsInRect = false;
        }
      }

      if (isCoordinatesInElement(element, x, y)) {
        //If this is most child element among rects containing click point
        if (element.children.length === 0 || noChildElementIsInRect) {
          if ((selectedElement == null || newSelect) && thisSelectedElementKey == null) {
            thisSelectedElementKey = element.path;
          } else {
            if (selectedElement != null && selectedElement.path === element.path) {
              shouldSelectNext = true;
            } else if (shouldSelectNext) {
              thisSelectedElementKey = element.path;
              shouldSelectNext = false;
            }
          }
        }
        return true;
      }
      return false;
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
           swipeStart, swipeEnd, setSwipeStart, setSwipeEnd} = this.props;
    const {x, y} = this.state;
    /**
     * This is way to select overlapped behind views of Screenshot component
     */
    if (screenshotInteractionMode === 'select') {
      this.clickScreenshotElement(e.clientX, e.clientY);
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
