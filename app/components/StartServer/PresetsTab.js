import _ from 'lodash';
import React, { Component, PropTypes } from 'react';
import { ListGroup, ListItem } from 'react-photonkit';

import { propTypes, updateArg } from './shared';
import { ARG_DATA } from '../../reducers/StartServer';
import StartButton from './StartButton';
import SavePresetButton from './SavePresetButton';
import advancedStyles from './AdvancedTab.css';
import parentadvancedStyles from './StartServer.css';
import styles from './PresetsTab.css';

export default class PresetsTab extends Component {
  static propTypes = {...propTypes};

  componentWillMount () {
    this.props.getPresets();
  }

  hasPresets () {
    return !!_.size(this.props.presets);
  }

  emptyPresetList () {
    return (
      <div className={styles.noPresetsContainer}>
        <div className={styles.noPresetsMessage}>
          You don't yet have any presets. Create some on the Advanced tab.
        </div>
      </div>
    );
  }

  presetList () {
    const {presets} = this.props;
    return (
      <ListGroup className={styles.presetsList}>
        {_.toPairs(presets).map((p) =>
          <ListItem title={p[0]} subtitle="Last modified xxx" />
        )}
      </ListGroup>
    );
  }

  render () {
    const {startServer, serverStarting, presets} = this.props;

    return (
      <div className={advancedStyles.advancedForm}>
        <form onSubmit={startServer}>
          <div className={advancedStyles.inputSection}>
            {this.hasPresets() ? this.presetList() : this.emptyPresetList()}
            <div className={styles.presetsDetail}>
            </div>
          </div>
          <div className={advancedStyles.actions}>
            <StartButton {...{serverStarting, startServer, disabledOverride: !this.hasPresets()}} />
          </div>
        </form>
      </div>
    );
  }
}
