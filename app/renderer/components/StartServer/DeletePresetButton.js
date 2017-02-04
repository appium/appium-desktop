import React, { Component, PropTypes } from 'react';
import { Button } from 'antd';

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
        <Button className={styles.startButton}
         type={presetDeleting ? "disabled" : null}
         onClick={deletePreset}
        >{presetDeleting ? "Deleting..." : "Delete Preset"}</Button>
      </div>
    );
  }
}
