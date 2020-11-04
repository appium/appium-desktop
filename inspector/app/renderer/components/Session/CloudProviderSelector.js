import React, { Component } from 'react';
import _ from 'lodash';
import { Modal, Row, Col, Button } from 'antd';
import CloudProviders from './CloudProviders';
import SessionStyles from './Session.css';
import { BUTTON } from '../../../../../shared/components/AntdTypes';

export default class CloudProviderSelector extends Component {

  componentDidMount () {
    const {setLocalServerParams, getSavedSessions, setSavedServerParams, getRunningSessions} = this.props;
    (async () => {
      await getSavedSessions();
      await setSavedServerParams();
      await setLocalServerParams();
      getRunningSessions();
    })();
  }

  toggleVisibleProvider (providerName) {
    const {addVisibleProvider, removeVisibleProvider, visibleProviders = []} = this.props;
    if (visibleProviders.includes(providerName)) {
      removeVisibleProvider(providerName);
    } else {
      addVisibleProvider(providerName);
    }
  }

  handleCloseModal () {
    const {stopAddCloudProvider} = this.props;
    stopAddCloudProvider();
  }

  render () {
    const {t, isAddingCloudProvider, stopAddCloudProvider, visibleProviders = []} = this.props;
    const providersGrid = _.chunk(_.keys(CloudProviders), 2); // Converts list of providers into list of pairs of providers
    const footer = [<Button key="back" type={BUTTON.PRIMARY} onClick={stopAddCloudProvider}>{t('Done')}</Button>];

    return <Modal key="modal"
      className={SessionStyles.cloudProviderModal}
      visible={isAddingCloudProvider}
      onCancel={stopAddCloudProvider}
      footer={footer}
      title={t('Select Cloud Providers')}>
      {[
        ..._.map(providersGrid, (row, key) => <Row gutter={16} key={key}>{
          [
            ..._(row).map((providerName) => {
              const providerIsVisible = visibleProviders.includes(providerName);
              const style = {};
              if (providerIsVisible) {
                style.borderColor = '#40a9ff';
              }
              const provider = CloudProviders[providerName];
              return provider && <Col span={12} key={providerName}>
                <Button role="checkbox" style={style} onClick={() => this.toggleVisibleProvider(providerName)}><img src={provider.logo} /></Button>
              </Col>;
            })
          ]
        }</Row>)
      ]}
    </Modal>;
  }
}
