import React, { Component, PropTypes } from 'react';
import { Button } from 'react-photonkit';

import styles from './StartButton.css';

export default class DeletePresetButton extends Component {
  static propTypes = {
    presetDeleting: PropTypes.bool.isRequired,
    deletePreset: PropTypes.func.isRequired,
  }

  render () {
    const {presetDeleting, deletePreset} = this.props;

    return (
      <div>
        <Button className={styles.startButton} type="button"
         ptStyle={presetDeleting ? "disabled" : "negative"}
         text={presetDeleting ? "Deleting..." : "Delete Preset"}
         onClick={deletePreset}
        />
      </div>
    );
  }
}
