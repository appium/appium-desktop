import { clipboard } from 'electron';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Card, Select, Tooltip, Button, Icon } from 'antd';
import InspectorStyles from './Inspector.css';
import frameworks from '../../lib/client-frameworks';
import { highlight } from 'highlight.js';

const Option = Select.Option;
const ButtonGroup = Button.Group;

export default class RecordedActions extends Component {


  code (raw = true) {
    let {showBoilerplate, sessionDetails, recordedActions, actionFramework
    } = this.props;
    let {host, port, path, https, desiredCapabilities} = sessionDetails;

    let framework = new frameworks[actionFramework](host, port, path,
      https, desiredCapabilities);
    framework.actions = recordedActions;
    let rawCode = framework.getCodeString(showBoilerplate);
    if (raw) {
      return rawCode;
    }
    return highlight(framework.language, rawCode, true).value;
  }

  actionBar () {
    let {showBoilerplate, recordedActions, setActionFramework,
      toggleShowBoilerplate, clearRecording, closeRecorder,
      actionFramework, isRecording, showSaveTestModal
    } = this.props;

    let frameworkOpts = Object.keys(frameworks).map((f) => <Option value={f}>
      {frameworks[f].readableName}
    </Option>);

    let boilerplateType = showBoilerplate ? "primary" : "default";

    return <div>
      {!!recordedActions.length &&
        <Select defaultValue={actionFramework} onChange={setActionFramework}
         className={InspectorStyles['framework-dropdown']} size="small">
          {frameworkOpts}
        </Select>
      }
      {(!!recordedActions.length || !isRecording) &&
        <ButtonGroup size="small">
        {!!recordedActions.length &&
          <Tooltip title="Show/Hide Boilerplate Code">
            <Button onClick={toggleShowBoilerplate} icon="export"
             type={boilerplateType}
            />
          </Tooltip>
        }
        {!!recordedActions.length &&
          <Tooltip title="Copy code to clipboard">
            <Button icon="copy"
             onClick={() => clipboard.writeText(this.code())}
            />
          </Tooltip>
        }
        {!!recordedActions.length &&
          <Tooltip title="Save to test library...">
            <Button icon="save"
             onClick={showSaveTestModal}
            />
          </Tooltip>
        }
        {!!recordedActions.length &&
          <Tooltip title="Clear Actions">
            <Button icon="delete" onClick={clearRecording}/>
          </Tooltip>
        }
        {!isRecording &&
          <Tooltip title="Close Recorder">
            <Button icon="close" onClick={closeRecorder}/>
          </Tooltip>
        }
        </ButtonGroup>
      }
    </div>;
  }

  render () {
    const {recordedActions} = this.props;

    const highlightedCode = this.code(false);

    return <Card title={<span><Icon type="code-o"/> Recorder</span>}
     className={InspectorStyles['recorded-actions']}
     extra={this.actionBar()}
    >
      {!recordedActions.length &&
       <div className={InspectorStyles['no-recorded-actions']}>
        Perform some actions to see code show up here
       </div>
      }
      {!!recordedActions.length &&
       <div className={InspectorStyles['recorded-code']}
        dangerouslySetInnerHTML={{__html: highlightedCode}} />
      }
    </Card>;
  }
}

