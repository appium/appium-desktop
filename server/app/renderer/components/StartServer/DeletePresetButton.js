import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';
import { withTranslation } from '../../util';

import styles from './StartButton.css';
import { BUTTON } from '../../../../../shared/components/AntdTypes';

class DeletePresetButton extends Component {
  render () {
    const {presetDeleting, deletePreset, t} = this.props;

    return (
      <div>
        <Button className={styles.startButton}
          type={presetDeleting ? BUTTON.DISABLED : BUTTON.DEFAULT}
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
