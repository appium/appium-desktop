import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';

import styles from './StartButton.css';

export default class DeletePresetButton extends Component {
  render () {
    const {presetDeleting, deletePreset} = this.props;

    return (
      <div>
        <Button className={styles.startButton}
          type={presetDeleting ? 'disabled' : null}
          onClick={deletePreset}
        >{presetDeleting ? 'Deleting...' : 'Delete Preset'}</Button>
      </div>
    );
  }
}

DeletePresetButton.propTypes = {
  presetDeleting: PropTypes.bool.isRequired,
  deletePreset: PropTypes.func.isRequired,
};