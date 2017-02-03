import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Card, Icon, Button, Spin } from 'antd';
import Screenshot from './Inspector/Screenshot';
import SelectedElement from './Inspector/SelectedElement';
import Source from './Inspector/Source';
import InspectorStyles from './Inspector.css';

export default class Inspector extends Component {

  constructor () {
    super();
    this.didInitialResize = false;
  }

  componentWillMount () {
    const chromeHeight = 48;
    if (!this.didInitialResize) {
      // resize width to something sensible for using the inspector on first run
      window.resizeTo(1150, window.clientHeight - chromeHeight);
      this.didInitialResize = true;
    }
    this.props.bindAppium();
    this.props.applyClientMethod({methodName: 'source'});
  }

  render () {
    const {screenshot, selectedElement = {}, applyClientMethod, quitSession} = this.props;
    const {path} = selectedElement;

    let actions = <span>
      <Button icon='arrow-left' onClick={() => applyClientMethod({methodName: 'back'})}>
        Back
      </Button>
      <Button icon='reload' onClick={() => applyClientMethod({methodName: 'source'})}>
        Refresh
      </Button>
      <Button icon='close' onClick={() => quitSession()} size="small">
        Quit
      </Button>
    </span>;

    return <div className={InspectorStyles['inspector-container']}>
      <div className={InspectorStyles['screenshot-container']}>
        {screenshot && <Screenshot {...this.props} />}
        {!screenshot &&
          <Spin size="large" spinning={true}>
            <div className={InspectorStyles.screenshotBox} />
          </Spin>
        }
      </div>
      <div className={InspectorStyles['source-tree-container']}>
        <Card
         title={<span><Icon type="file-text" /> App Source</span>}
         extra={actions}
         className={InspectorStyles['source-tree-card']}>
          <Source {...this.props} />
        </Card>
      </div>
      <div className={`${InspectorStyles['source-tree-container']} ${InspectorStyles['element-detail-container']}`}>
        <Card
         title={<span><Icon type="tag-o" /> Selected Element</span>}
         className={InspectorStyles['source-tree-card']}>
         {path && <SelectedElement {...this.props}/>}
         {!path && <i>Select an element in the source to begin.</i>}
        </Card>
      </div>
    </div>;
  }
}
