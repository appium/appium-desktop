import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import InspectorStyles from './Inspector.css';
import frameworks from '../../client-frameworks';
import { highlight } from 'highlight.js';

export default class RecordedActions extends Component {
  render () {
    const {recordedActions, actionFramework} = this.props;
    // TODO add server connection info to this constructor call
    let framework = new frameworks[actionFramework]("foo", "bar", "baz");
    framework.actions = recordedActions;
    const rawCode = framework.getCodeString();
    const highlightedCode = highlight(framework.language, rawCode, true).value;
    // TODO use framework.language to set up syntax highlighting
    return <div>
      {!recordedActions.length &&
       <div className={InspectorStyles['no-recorded-actions']}>
        Perform some actions to see code show up here
       </div>
      }
      {!!recordedActions.length &&
       <div className={InspectorStyles['recorded-code']}
        dangerouslySetInnerHTML={{__html: highlightedCode}} />
      }
    </div>;
  }
}

