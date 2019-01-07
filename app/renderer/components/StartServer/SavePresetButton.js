import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';

import styles from './StartButton.css';

export default class SavePresetButton extends Component {
  render () {
    const {presetSaving, savePreset} = this.props;

    return (
      <div>
        <Button className={styles.startButton}
          type={presetSaving ? 'disabled' : ''}
          onClick={savePreset}
        >{presetSaving ? 'Saving...' : 'Save As Preset...'}</Button>
        <input type="submit" hidden={true} />
      </div>
    );
  }
}

SavePresetButton.propTypes = {
  presetSaving: PropTypes.bool.isRequired,
  savePreset: PropTypes.func.isRequired,
};
