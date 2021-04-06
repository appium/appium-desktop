import _ from 'lodash';
import moment from 'moment';
import React, { Component } from 'react';
import { notification, Table } from 'antd';
import { withTranslation } from '../../util';

import { propTypes } from './shared';
import StartButton from './StartButton';
import DeletePresetButton from './DeletePresetButton';
import advancedStyles from './AdvancedTab.css';
import styles from './PresetsTab.css';

class PresetsTab extends Component {

  constructor (props) {
    super(props);
    this.state = {selectedPreset: null};
  }

  componentDidMount () {
    this.props.getPresets();
  }

  hasPresets () {
    return !!_.size(this.props.presets);
  }

  presetIsSelected () {
    return this.hasPresets() && this.state.selectedPreset;
  }

  emptyPresetList () {
    const {t} = this.props;
    return (
      <div className={styles.noPresetsContainer}>
        <div className={styles.noPresetsMessage}>
          {t('noPresets')}
        </div>
      </div>
    );
  }

  selectedPresetData (presetName = null) {
    if (!presetName) {presetName = this.state.selectedPreset;}
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

    for (let [argName, newVal] of _.toPairs(preset)) { // eslint-disable-line no-unused-vars
      if (serverArgs[argName] !== newVal) {
        updateArgs({[argName]: newVal});
      }
    }
  }

  deletePreset (evt) {
    const {t} = this.props;

    evt.preventDefault();
    if (window.confirm(t('deleteSelectedPresetConfirmation', {presetName: this.state.selectedPreset}))) {
      this.props.deletePreset(this.state.selectedPreset);
      this.setState({selectedPreset: null});
      notification.success({
        message: t('Deleted'),
        description: t('Preset successfully trashed')
      });
    }
  }

  presetList () {
    const {presets, t} = this.props;
    return (
      <ul className={styles.presetsList}>
        {_.toPairs(presets).map((p) =>
          <a
            onClick={this.selectPreset.bind(this, p[0])}
            key={p[0]}
            className={styles.presetLink}
          >
            <li className={`${styles.preset} ${p[0] === this.state.selectedPreset ? styles.presetItemActive : ''}`}>
              <div className={styles.presetItemTitle}>{p[0]}</div>
              <div className={styles.presetItemDesc}>{t('savedTimestamp', {when: moment(p[1]._modified).fromNow()})}</div>
            </li>
          </a>
        )}
      </ul>
    );
  }

  presetDetail () {
    const {t} = this.props;
    const preset = this.selectedPresetData();
    if (preset) {
      const columns = [{
        title: t('Server Argument'),
        dataIndex: 'arg',
        width: 200
      }, {
        title: t('Value'),
        dataIndex: 'val',
      }];
      let data = [];
      for (let [arg, val] of _.toPairs(preset)) { // eslint-disable-line no-unused-vars
        data.push({
          key: arg,
          arg,
          val: typeof val === 'string' ? val : JSON.stringify(val)
        });
      }
      return (
        <div className={styles.presetsDetail}>
          <Table columns={columns} dataSource={data} size="small"
            pagination={false}
          />
        </div>
      );
    }
    return '';
  }

  render () {
    const {startServer, serverStarting, presetDeleting, serverVersion} = this.props;

    return (
      <div className={advancedStyles.advancedForm}>
        <form onSubmit={startServer}>
          <div className={styles.presetsSection}>
            {this.hasPresets() ? this.presetList() : this.emptyPresetList()}
            {this.presetIsSelected() ? this.presetDetail() : ''}
          </div>
          <div className={advancedStyles.actions}>
            <StartButton {...{serverStarting, startServer, serverVersion, disabledOverride: !this.presetIsSelected()}} />
            {this.presetIsSelected() &&
              <DeletePresetButton {...{presetDeleting, deletePreset: this.deletePreset.bind(this)}} />
            }
          </div>
        </form>
      </div>
    );
  }
}

PresetsTab.propTypes = {...propTypes};

export default withTranslation(PresetsTab);
