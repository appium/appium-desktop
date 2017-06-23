import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Card, Icon, Button, Spin, Select } from 'antd';
import Screenshot from './Screenshot';
import SelectedElement from './SelectedElement';
import Source from './Source';
import SourceScrollButtons from './SourceScrollButtons';
import InspectorStyles from './Inspector.css';
import RecordedActions from './RecordedActions';
import frameworks from '../../client-frameworks';

const Option = Select.Option;
const ButtonGroup = Button.Group;

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
    const {screenshot, screenshotError, selectedElement = {},
           applyClientMethod, quitSession, isRecording,
           showRecord, recordedActions, actionFramework,
           startRecording, pauseRecording, setActionFramework,
           clearRecording, closeRecorder} = this.props;
    const {path} = selectedElement;

    let actions = <ButtonGroup size="small">
      <Button icon='arrow-left' onClick={() => applyClientMethod({methodName: 'back'})}>
        Back
      </Button>
      <Button icon='reload' onClick={() => applyClientMethod({methodName: 'source'})}>
        Refresh
      </Button>
      {!isRecording &&
       <Button icon="eye-o" onClick={startRecording}>Record</Button>
      }
      {isRecording &&
       <Button icon="pause" onClick={pauseRecording}>Pause Recording</Button>
      }
      <Button icon='close' onClick={() => quitSession()}>
        Quit
      </Button>
    </ButtonGroup>;


    let frameworkOpts = Object.keys(frameworks).map((f) => <Option value={f}>
      {frameworks[f].readableName}
    </Option>);
    let recorderActions = <div>
      <Select defaultValue={actionFramework} onChange={setActionFramework}
       className={InspectorStyles['framework-dropdown']} size="small">
        {frameworkOpts}
      </Select>
      {!!recordedActions.length &&
        <Button icon="delete" onClick={clearRecording} size="small">Clear</Button>
      }
      {!isRecording &&
        <Button icon="close" onClick={closeRecorder} size="small"></Button>
      }
    </div>;

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
        <div
         className={InspectorStyles['controls-card']}>
          {actions}
        </div>
        {showRecord &&
          <Card
           title={<span><Icon type="code-o" /> Recorded Actions</span>}
           className={InspectorStyles['recorded-actions']}
           extra={recorderActions}
          >
            <RecordedActions {...this.props} />
          </Card>
        }
        <Card
         title={<span><Icon type="file-text" /> App Source</span>}
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
