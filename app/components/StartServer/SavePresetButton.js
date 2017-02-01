import React, { Component, PropTypes } from 'react';
import { Button } from 'antd';

import styles from './StartButton.css';

export default class SavePresetButton extends Component {
  static propTypes = {
    presetSaving: PropTypes.bool.isRequired,
    savePreset: PropTypes.func.isRequired,
  }

  render () {
    const {presetSaving, savePreset} = this.props;

    return (
      <div>
        <Button className={styles.startButton}
         type={presetSaving ? "disabled" : ""}
         onClick={savePreset}
        >{presetSaving ? "Saving..." : "Save As Preset..."}</Button>
        <input type="submit" hidden={true} />
      </div>
    );
  }
}
