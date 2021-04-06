import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';

import { propTypes } from './shared';
import SimpleTab from './SimpleTab';
import AdvancedTab from './AdvancedTab';
import PresetsTab from './PresetsTab';
import styles from './StartServer.css';

import AppiumLogo from '../../images/appium_logo.png';
import { BUTTON } from '../../../../../shared/components/AntdTypes';

const TAB_SIMPLE = 0, TAB_ADVANCED = 1, TAB_PRESETS = 2;

export default class StartServer extends Component {

  displayTab () {
    const {t} = this.props;

    switch (this.props.tabId) {
      case TAB_SIMPLE:
        return <SimpleTab {...this.props} />;
      case TAB_ADVANCED:
        return <AdvancedTab {...this.props} />;
      case TAB_PRESETS:
        return <PresetsTab {...this.props} />;
      default:
        throw new Error(t('Invalid tab id'));
    }
  }

  render () {
    const {tabId, switchTab, t} = this.props;
    return (
      <div className={styles.container}>
        <div className={styles.formAndLogo}>
          <img src={AppiumLogo} className={styles.logo} />
          <div className={styles.tabs}>
            <Button.Group className={styles.tabButtons}>
              <Button type={tabId === TAB_SIMPLE ? BUTTON.PRIMARY : BUTTON.DEFAULT }
                onClick={() => switchTab(TAB_SIMPLE)}
              >{t('Simple')}</Button>
              <Button type={tabId === TAB_ADVANCED ? BUTTON.PRIMARY : BUTTON.DEFAULT }
                onClick={() => switchTab(TAB_ADVANCED)}
              >{t('Advanced')}</Button>
              <Button type={tabId === TAB_PRESETS ? BUTTON.PRIMARY : BUTTON.DEFAULT }
                onClick={() => switchTab(TAB_PRESETS)}
              >{t('Presets')}</Button>
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
