import React, { Component } from 'react';
import { Button, Radio, Icon } from 'antd';


/**
 * Actions that can be performed on source
 */
export default class Actions extends Component {

  handleScreenshotInteractionChange (e) {
    const {selectScreenshotInteractionMode} = this.props;
    
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
