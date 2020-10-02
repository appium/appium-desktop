import React, { Component } from 'react';
import { debounce } from 'lodash';
import HighlighterRects from './HighlighterRects';
import { Spin, Tooltip } from 'antd';
import B from 'bluebird';
import styles from './Inspector.css';
import { SCREENSHOT_INTERACTION_MODE } from './shared';
import { withTranslation } from '../../util';

const {TAP, SELECT, SWIPE} = SCREENSHOT_INTERACTION_MODE;

/**
 * Shows screenshot of running application and divs that highlight the elements' bounding boxes
 */
class Screenshot extends Component {

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

  async handleScreenshotClick () {
    const {screenshotInteractionMode, applyClientMethod,
           swipeStart, swipeEnd, setSwipeStart, setSwipeEnd} = this.props;
    const {x, y} = this.state;

    if (screenshotInteractionMode === TAP) {
      applyClientMethod({
        methodName: TAP,
        args: [x, y],
      });
    } else if (screenshotInteractionMode === SWIPE) {
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

    if (screenshotInteractionMode !== SELECT) {
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
      methodName: SWIPE,
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
    const {
      screenshot,
      methodCallInProgress,
      screenshotInteractionMode,
      swipeStart,
      swipeEnd,
      t,
    } = this.props;
    const {scaleRatio, x, y} = this.state;

    // If we're tapping or swiping, show the 'crosshair' cursor style
    const screenshotStyle = {};
    if ([TAP, SWIPE].includes(screenshotInteractionMode)) {
      screenshotStyle.cursor = 'crosshair';
    }

    let swipeInstructions = null;
    if (screenshotInteractionMode === SWIPE && (!swipeStart || !swipeEnd)) {
      if (!swipeStart) {
        swipeInstructions = t('Click swipe start point');
      } else if (!swipeEnd) {
        swipeInstructions = t('Click swipe end point');
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
            <p>{t('xCoordinate', {x})}</p>
            <p>{t('yCoordinate', {y})}</p>
          </div>}
          {swipeInstructions && <Tooltip visible={true} placement="top" title={swipeInstructions}>{screenImg}</Tooltip>}
          {!swipeInstructions && screenImg}
          {screenshotInteractionMode === SELECT && this.containerEl && <HighlighterRects {...this.props} containerEl={this.containerEl} />}
          {screenshotInteractionMode === SWIPE &&
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

export default withTranslation(Screenshot);
