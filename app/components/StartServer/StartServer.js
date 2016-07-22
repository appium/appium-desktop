import React, { Component, PropTypes } from 'react';
import { Button } from 'react-photonkit';

import { propTypes } from './shared';
import SimpleTab from './SimpleTab';
import AdvancedTab from './AdvancedTab';
import styles from './StartServer.css';

const TAB_SIMPLE = 0, TAB_ADVANCED = 1, TAB_PRESETS = 2;

export default class StartServer extends Component {
  static propTypes = {
    ...propTypes,
    tabId: PropTypes.number.isRequired,
    switchTab: PropTypes.func.isRequired,
  }

  displayTab () {
    switch (this.props.tabId) {
      case TAB_SIMPLE:
        return <SimpleTab {...this.props} />;
      case TAB_ADVANCED:
        return <AdvancedTab {...this.props} />;
      case TAB_PRESETS:
        return "";
      default:
        throw new Error("Invalid tab id");
    }
  }

  render () {
    const {tabId, switchTab} = this.props;
    return (
      <div className={styles.container}>
        <div className={styles.formAndLogo}>
          <img src={'../images/appium_logo.png'} className={styles.logo} />
          <div className={styles.tabs}>
            <div className={`btn-group ${styles.tabButtons}`}>
              <Button text="Simple"
                ptStyle={tabId === TAB_SIMPLE ? "primary" : "default" }
                onClick={() => switchTab(TAB_SIMPLE)}
              />
              <Button text="Advanced"
                ptStyle={tabId === TAB_ADVANCED ? "primary" : "default" }
                onClick={() => switchTab(TAB_ADVANCED)}
              />
              <Button text="Presets"
                ptStyle={tabId === TAB_PRESETS ? "primary" : "default" }
                onClick={() => switchTab(TAB_PRESETS)}
              />
            </div>
          </div>
          {this.displayTab()}
        </div>
      </div>
    );
  }
}
