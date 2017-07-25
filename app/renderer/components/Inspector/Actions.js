import React, { Component } from 'react';
import { Radio } from 'antd';


/**
 * Actions that can be performed on source
 */
export default class Actions extends Component {

  handleScreenshotInteractionChange (e) {
    const {selectScreenshotInteractionMode, clearSwipeAction} = this.props;
    clearSwipeAction(); // When the action changes, reset the swipe action
    selectScreenshotInteractionMode(e.target.value);
  }

  render () {
    const {screenshotInteractionMode} = this.props;

    return <div>
      <Radio.Group value={screenshotInteractionMode} onChange={this.handleScreenshotInteractionChange.bind(this)}>
        <Radio.Button value='select'>Select</Radio.Button>
        <Radio.Button value='swipe'>Swipe</Radio.Button>
        <Radio.Button value='tap'>Tap</Radio.Button>
      </Radio.Group>
    </div>;
  }
}
