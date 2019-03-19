import { shell } from 'electron';
import React, { Component } from 'react';
import _ from 'lodash';
import NewSessionForm from './NewSessionForm';
import SavedSessions from './SavedSessions';
import AttachToSession from './AttachToSession';
import ServerTabAutomatic from './ServerTabAutomatic';
import ServerTabCustom from './ServerTabCustom';
import { Tabs, Button, Spin, Icon, Modal, Row, Col } from 'antd';
import { ServerTypes } from '../../actions/Session';
import AdvancedServerParams from './AdvancedServerParams';
import SessionStyles from './Session.css';
import CloudProviders from './CloudProviders';

const {TabPane} = Tabs;

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

    return <Modal key="modal" width="2000" visible={isAddingCloudProvider} onCancel={stopAddCloudProvider} title="Select Cloud Provider">
      {[
        ..._(CloudProviders).map((provider, key) => (
          <Row gutter={16} style={{marginBottom: '16px'}} key={key}>
            <Col span={24} key={key}>
              <Button onClick={() => this.selectCloudProvider(key)} style={{width: '100%'}}><img style={{maxHeight: '100%'}} src={provider.logo} /></Button>
            </Col>
          </Row>
        ))
      ]}
    </Modal>;
  }
}
