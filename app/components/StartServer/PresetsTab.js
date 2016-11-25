import _ from 'lodash';
import moment from 'moment';
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

  constructor (props) {
    super(props);
    this.state = {selectedPreset: null};
  }

  componentWillMount () {
    this.props.getPresets();
  }

  hasPresets () {
    return !!_.size(this.props.presets);
  }

  presetIsSelected () {
    return this.hasPresets() && this.state.selectedPreset;
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

  selectedPresetData (presetName = null) {
    if (!presetName) presetName = this.state.selectedPreset;
    const {presets} = this.props;
    const preset = presets[presetName];
    if (preset._modified) {
      delete preset._modified;
    }
    return preset;
  }

  selectPreset (presetName) {
    const {serverArgs, updateArgs} = this.props;

    this.setState({selectedPreset: presetName});

    const preset = this.selectedPresetData(presetName);

    for (let [argName, newVal] of _.toPairs(preset)) {
      if (serverArgs[argName] !== newVal) {
        updateArgs({[argName]: newVal});
      }
    }
  }

  presetList () {
    const {presets} = this.props;
    return (
      <ListGroup className={styles.presetsList}>
        {_.toPairs(presets).map((p) =>
          <a
           onClick={this.selectPreset.bind(this, p[0])}
           key={p[0]}
           className={styles.presetLink}
          >
            <ListItem
             title={p[0]}
             subtitle={`Saved ${moment(p[1]._modified).fromNow()}`}
             active={p[0] === this.state.selectedPreset}
             className={styles.preset}
            />
          </a>
        )}
      </ListGroup>
    );
  }

  presetDetail () {
    const preset = this.selectedPresetData();
    if (preset) {
      return (
        <div className={styles.presetsDetail}>
          {_.toPairs(preset).map((p) =>
            <div className={styles.presetData}><b>{p[0]}:</b> {JSON.stringify(p[1])}</div>
          )}
        </div>
      );
    }
    return "";
  }

  render () {
    const {startServer, serverStarting, presets} = this.props;

    return (
      <div className={advancedStyles.advancedForm}>
        <form onSubmit={startServer}>
          <div className={styles.presetsSection}>
            {this.hasPresets() ? this.presetList() : this.emptyPresetList()}
            {this.presetIsSelected() ? this.presetDetail() : ""}
          </div>
          <div className={advancedStyles.actions}>
            <StartButton {...{serverStarting, startServer, disabledOverride: !this.presetIsSelected()}} />
          </div>
        </form>
      </div>
    );
  }
}
