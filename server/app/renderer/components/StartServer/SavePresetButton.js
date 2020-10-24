import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';
import { withTranslation } from '../../util';
import styles from './StartButton.css';
import { BUTTON, INPUT } from '../../../../../shared/components/AntdTypes';

class SavePresetButton extends Component {
  render () {
    const {presetSaving, savePreset, t} = this.props;

    return (
      <div>
        <Button className={styles.startButton}
          type={presetSaving ? BUTTON.DISABLED : BUTTON.DEFAULT}
          onClick={savePreset}
        >{presetSaving ? t('Saving…') : t('Save As Preset…')}</Button>
        <input type={INPUT.SUBMIT} hidden={true} />
      </div>
    );
  }
}

SavePresetButton.propTypes = {
  presetSaving: PropTypes.bool.isRequired,
  savePreset: PropTypes.func.isRequired,
};

export default withTranslation(SavePresetButton);
