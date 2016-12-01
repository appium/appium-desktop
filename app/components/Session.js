import React, { Component, PropTypes } from 'react';
import styles from './Session.css';
import settings from 'electron-settings';
import NewSessionForm from './Session/NewSessionForm';

let { desiredCapabilityConstraints } = require('appium-base-driver/build/lib/basedriver/desired-caps');

desiredCapabilityConstraints = {
  app: {
    isFile: true,
    presence: true,
  },
  ...desiredCapabilityConstraints,
};

const MOST_RECENT_DESIRED_CAPABILITIES = 'mostRecentDesiredCapabilities';

export default class Session extends Component {
  constructor (props) {
    super(props);

    let dcaps = {};

    // Set default values for capabilities
    Object.keys(desiredCapabilityConstraints).map((key) => {
      let cap = desiredCapabilityConstraints[key];

      // If it's a select, choose the first by default
      if (cap.inclusionCaseInsensitive || cap.inclusion) {
        dcaps[key] = (cap.inclusionCaseInsensitive || cap.inclusion)[0];
      } else if (cap.isBoolean) {
        dcaps[key] = false;
      } else {
        dcaps[key] = '';
      }
    });

    this.state = {
      desiredCapabilities: dcaps,
      desiredCapabilityConstraints,
    };
  }

  static propTypes = {
    newSession: PropTypes.func,
  }

  saveDesiredCaps () {
    settings.set(MOST_RECENT_DESIRED_CAPABILITIES, this.state);
  }

  handleChangeCapability (key, value) {
    let state = this.state;
    let nextState = {...state};
    nextState.desiredCapabilities[key] = value;
    this.setState(nextState);
  }

  render () {
    const { newSession } = this.props;

    return (
      <div className={styles.container}>
        <h2>Start New Session</h2>
        <NewSessionForm onCreateNewSession={() => newSession(this.state.desiredCapabilities)} 
          onChangeCapability={this.handleChangeCapability.bind(this)}
          desiredCapabilities={this.state.desiredCapabilities}
          desiredCapabilityConstraints={desiredCapabilityConstraints}/>
      </div>
    );
  }
}