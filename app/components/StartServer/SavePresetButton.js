import React, { Component, PropTypes } from 'react';
import { Button } from 'react-photonkit';

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
        <Button className={styles.startButton} type="button"
         ptStyle={presetSaving ? "disabled" : "positive"}
         text={presetSaving ? "Saving..." : "Save As Preset..."}
         onClick={savePreset}
        />
        <input type="submit" hidden={true} />
      </div>
    );
  }
}
