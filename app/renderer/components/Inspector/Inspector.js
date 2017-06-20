import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Card, Icon, Button, Spin } from 'antd';
import Screenshot from './Screenshot';
import SelectedElement from './SelectedElement';
import Source from './Source';
import SourceScrollButtons from './SourceScrollButtons';
import InspectorStyles from './Inspector.css';

export default class Inspector extends Component {

  constructor () {
    super();
    this.didInitialResize = false;
    this.state = {};
  }

  componentWillMount () {
    const chromeHeight = 48;
    if (!this.didInitialResize) {
      // resize width to something sensible for using the inspector on first run
      window.resizeTo(1080, window.clientHeight - chromeHeight);
      this.didInitialResize = true;
    }
    this.props.bindAppium();
    this.props.applyClientMethod({methodName: 'source'});
  }

  render () {
    const {screenshot, screenshotError, selectedElement = {}, applyClientMethod, quitSession} = this.props;
    const {path} = selectedElement;

    let actions = <span>
      <Button icon='arrow-left' onClick={() => applyClientMethod({methodName: 'back'})} size="small" >
        Back
      </Button>
      <Button icon='reload' onClick={() => applyClientMethod({methodName: 'source'})} size="small">
        Refresh
      </Button>
      <Button icon='close' onClick={() => quitSession()} size="small">
        Quit
      </Button>
    </span>;

    return <div className={InspectorStyles['inspector-container']}>
      <div className={InspectorStyles['screenshot-container']}>
        {screenshot && <Screenshot {...this.props} />}
        {screenshotError && `Could not obtain screenshot: ${screenshotError}`}
        {!screenshot && !screenshotError &&
          <Spin size="large" spinning={true}>
            <div className={InspectorStyles.screenshotBox} />
          </Spin>
        }
      </div>
      <div className={InspectorStyles['source-tree-container']} ref={(div) => this.container = div} >
        <Card
         title={<span><Icon type="file-text" /> App Source</span>}
         extra={actions}
         className={InspectorStyles['source-tree-card']}>
          <Source {...this.props} />
        </Card>
        {this.container && <SourceScrollButtons container={this.container} />}
      </div>
      <div className={`${InspectorStyles['source-tree-container']} ${InspectorStyles['element-detail-container']}`}>
        <Card
         title={<span><Icon type="tag-o" /> Selected Element</span>}
         className={InspectorStyles['selected-element-card']}>
         {path && <SelectedElement {...this.props}/>}
         {!path && <i>Select an element in the source to begin.</i>}
        </Card>
      </div>
    </div>;
  }
}
