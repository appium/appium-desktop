import React, { Component } from 'react';
import _ from 'lodash';
import { Modal, Row, Col, Button } from 'antd';
import CloudProviders from './CloudProviders';
import SessionStyles from './Session.css';

export default class CloudProviderSelector extends Component {

  constructor (props) {
    super(props);
    this.state = {
      visibleProviders: {}
    };
  }

  componentWillMount () {
    const {setLocalServerParams, getSavedSessions, setSavedServerParams, getRunningSessions} = this.props;
    (async () => {
      await getSavedSessions();
      await setSavedServerParams();
      await setLocalServerParams();
      getRunningSessions();
    })();
  }

  handleSelectServerTab (tab) {
    const {changeServerType, addCloudProvider} = this.props;
    if (tab === 'addCloudProvider') {
      addCloudProvider();
      return;
    }
    changeServerType(tab);
  }

  selectCloudProvider (providerName) {
    const {stopAddCloudProvider, addVisibleProvider, changeServerType} = this.props;
    addVisibleProvider(providerName);
    stopAddCloudProvider();
    changeServerType(providerName);
  }

  render () {
    const {t, isAddingCloudProvider, stopAddCloudProvider} = this.props;
    const providersGrid = _.chunk(_.keys(CloudProviders), 2); // Converts list of providers into list of pairs of providers

    return <Modal key="modal" className={SessionStyles.cloudProviderModal} visible={isAddingCloudProvider} onCancel={stopAddCloudProvider} title={t('Select Cloud Provider')}>
      {[
        ..._.map(providersGrid, (row, key) => (
          <Row gutter={16} key={key}>{
            [
              ..._(row).map((providerName) => {
                const provider = CloudProviders[providerName];
                return provider && <Col span={12} key={providerName}>
                  <Button onClick={() => this.selectCloudProvider(providerName)}><img src={provider.logo} /></Button>
                </Col>;
              })
            ]
          }</Row>
        ))
      ]}
    </Modal>;
  }
}
