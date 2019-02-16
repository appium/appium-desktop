import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';
import { withTranslation } from '../../util';
import styles from './StartButton.css';

class SavePresetButton extends Component {
  render () {
    const {presetSaving, savePreset, t} = this.props;

    return (
      <div>
        <Button className={styles.startButton}
          type={presetSaving ? 'disabled' : ''}
          onClick={savePreset}
        >{presetSaving ? t('Saving…') : t('Save As Preset…')}</Button>
        <input type="submit" hidden={true} />
      </div>
    );
  }
}

SavePresetButton.propTypes = {
  presetSaving: PropTypes.bool.isRequired,
  savePreset: PropTypes.func.isRequired,
};

export default withTranslation(SavePresetButton);
