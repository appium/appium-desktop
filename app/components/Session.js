import React, { Component, PropTypes } from 'react';
import styles from './Session.css';
import NewSessionForm from './Session/NewSessionForm';

let { desiredCapabilityConstraints } = require('appium-base-driver/build/lib/basedriver/desired-caps');

desiredCapabilityConstraints = {
  app: {
    isFile: true,
    presence: true,
  },
  ...desiredCapabilityConstraints,
};

export default class Session extends Component {
  constructor (props) {
    super(props);

    this.state = {
      desiredCapabilityConstraints
    };
  }

  static propTypes = {
    newSession: PropTypes.func,
  }

  componentDidMount () {
    this.props.requestedSavedCapabilities(desiredCapabilityConstraints);
  }

  render () {
    const { newSession, desiredCapabilities, changeCapability } = this.props;

    return (
      <div className={styles.container}>
        <h2>Start New Session</h2>
        { 
          desiredCapabilities &&
          <NewSessionForm onCreateNewSession={() => newSession(desiredCapabilities)} 
            onChangeCapability={changeCapability}
            desiredCapabilities={desiredCapabilities}
            desiredCapabilityConstraints={desiredCapabilityConstraints}/>
        }
      </div>
    );
  }
}