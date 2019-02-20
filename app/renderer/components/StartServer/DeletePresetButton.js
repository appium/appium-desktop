import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';
import { withTranslation } from '../../util';

import styles from './StartButton.css';

class DeletePresetButton extends Component {
  render () {
    const {presetDeleting, deletePreset, t} = this.props;

    return (
      <div>
        <Button className={styles.startButton}
          type={presetDeleting ? 'disabled' : null}
          onClick={deletePreset}
        >{presetDeleting ? t('Deleting…') : t('Delete Preset')}</Button>
      </div>
    );
  }
}

DeletePresetButton.propTypes = {
  presetDeleting: PropTypes.bool.isRequired,
  deletePreset: PropTypes.func.isRequired,
};

export default withTranslation(DeletePresetButton);
