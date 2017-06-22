import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import InspectorStyles from './Inspector.css';
import frameworks from '../../client-frameworks';

export default class RecordedActions extends Component {
  render () {
    const {recordedActions, actionFramework} = this.props;
    // TODO add server connection info to this constructor call
    let framework = new frameworks[actionFramework]("foo", "bar", "baz");
    framework.actions = recordedActions;
    return <div>
      {!recordedActions.length &&
       <div className={InspectorStyles['no-recorded-actions']}>
        Perform some actions to see code show up here
       </div>
      }
      {!!recordedActions.length &&
       <div className={InspectorStyles['recorded-code']}>
          {framework.getCodeString()}
       </div>
      }
    </div>;
  }
}
