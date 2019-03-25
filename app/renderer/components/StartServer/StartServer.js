import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';

import { propTypes } from './shared';
import SimpleTab from './SimpleTab';
import AdvancedTab from './AdvancedTab';
import PresetsTab from './PresetsTab';
import styles from './StartServer.css';

import AppiumLogo from '../../images/appium_logo.png';

const TAB_SIMPLE = 0, TAB_ADVANCED = 1, TAB_PRESETS = 2;

export default class StartServer extends Component {

  displayTab () {
    switch (this.props.tabId) {
      case TAB_SIMPLE:
        return <SimpleTab {...this.props} />;
      case TAB_ADVANCED:
        return <AdvancedTab {...this.props} />;
      case TAB_PRESETS:
        return <PresetsTab {...this.props} />;
      default:
        throw new Error('Invalid tab id');
    }
  }

  render () {
    const {tabId, switchTab} = this.props;
    return (
      <div className={styles.container}>
        <div className={styles.formAndLogo}>
          <img src={AppiumLogo} className={styles.logo} />
          <div className={styles.tabs}>
            <Button.Group className={styles.tabButtons}>
              <Button type={tabId === TAB_SIMPLE ? 'primary' : null }
                onClick={() => switchTab(TAB_SIMPLE)}
              >Simple</Button>
              <Button type={tabId === TAB_ADVANCED ? 'primary' : null }
                onClick={() => switchTab(TAB_ADVANCED)}
              >Advanced</Button>
              <Button type={tabId === TAB_PRESETS ? 'primary' : null }
                onClick={() => switchTab(TAB_PRESETS)}
              >Presets</Button>
            </Button.Group>
          </div>
          {this.displayTab()}
        </div>
      </div>
    );
  }
}

StartServer.propTypes = {
  ...propTypes,
  tabId: PropTypes.number.isRequired,
  switchTab: PropTypes.func.isRequired,
};
