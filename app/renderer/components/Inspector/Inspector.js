import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Card, Icon, Button, Spin, Tooltip } from 'antd';
import Screenshot from './Screenshot';
import SelectedElement from './SelectedElement';
import Source from './Source';
import SourceScrollButtons from './SourceScrollButtons';
import InspectorStyles from './Inspector.css';
import RecordedActions from './RecordedActions';

const ButtonGroup = Button.Group;

const MIN_WIDTH = 1080;
const MIN_HEIGHT = 570;

export default class Inspector extends Component {

  constructor () {
    super();
    this.didInitialResize = false;
    this.state = {};
  }

  componentWillMount () {
    const curHeight = window.innerHeight;
    const curWidth = window.innerWidth;
    const needsResize = (curHeight < MIN_HEIGHT) || (curWidth < MIN_WIDTH);
    if (!this.didInitialResize && needsResize) {
      const newWidth = curWidth < MIN_WIDTH ? MIN_WIDTH : curWidth;
      const newHeight = curHeight < MIN_HEIGHT ? MIN_HEIGHT : curHeight;
      // resize width to something sensible for using the inspector on first run
      window.resizeTo(newWidth, newHeight);
    }
    this.didInitialResize = true;
    this.props.bindAppium();
    this.props.applyClientMethod({methodName: 'source'});
    this.props.getSavedActionFramework();
  }

  render () {
    const {screenshot, screenshotError, selectedElement = {},
      applyClientMethod, quitSession, isRecording, showRecord, startRecording,
      pauseRecording} = this.props;
    const {path} = selectedElement;

    let main = <div id='screenshotContainer' className={InspectorStyles['inspector-main']}>
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
        {showRecord &&
          <RecordedActions {...this.props} />
        }
        <Card
         title={<span><Icon type="file-text" /> App Source</span>}
         className={InspectorStyles['source-tree-card']}>
          <Source {...this.props} />
        </Card>
        {this.container && <SourceScrollButtons container={this.container} />}
      </div>
      <div id='selectedElementContainer' className={`${InspectorStyles['source-tree-container']} ${InspectorStyles['element-detail-container']}`}>
        <Card
         title={<span><Icon type="tag-o" /> Selected Element</span>}
         className={InspectorStyles['selected-element-card']}>
         {path && <SelectedElement {...this.props}/>}
         {!path && <i>Select an element in the source to begin.</i>}
        </Card>
      </div>
    </div>;

    let controls = <div className={InspectorStyles['inspector-toolbar']}>
      <ButtonGroup size="large">
        <Tooltip title="Back">
          <Button id='btnGoBack' icon='arrow-left' onClick={() => applyClientMethod({methodName: 'back'})}/>
        </Tooltip>
        <Tooltip title="Refresh Source & Screenshot">
          <Button id='btnReload' icon='reload' onClick={() => applyClientMethod({methodName: 'source'})}/>
        </Tooltip>
        {!isRecording &&
         <Tooltip title="Start Recording">
          <Button id='btnStartRecording' icon="eye-o" onClick={startRecording}/>
         </Tooltip>
        }
        {isRecording &&
         <Tooltip title="Pause Recording">
           <Button id='btnPause' icon="pause" type="danger" onClick={pauseRecording}/>
         </Tooltip>
        }
        <Tooltip title="Quit Session & Close Inspector">
          <Button id='btnClose' icon='close' onClick={() => quitSession()}/>
        </Tooltip>
      </ButtonGroup>
    </div>;

    return <div className={InspectorStyles['inspector-container']}>
      {controls}
      {main}
    </div>;
  }
}
