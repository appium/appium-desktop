import { shell } from 'electron';
import React, { Component } from 'react';
import _ from 'lodash';
import NewSessionForm from './NewSessionForm';
import SavedSessions from './SavedSessions';
import AttachToSession from './AttachToSession';
import ServerTabCustom from './ServerTabCustom';
import { Tabs, Button, Spin } from 'antd';
import AdvancedServerParams from './AdvancedServerParams';
import SessionStyles from './Session.css';
import CloudProviders from './CloudProviders';
import CloudProviderSelector from './CloudProviderSelector';
import { LinkOutlined } from '@ant-design/icons';
import { BUTTON } from '../../../../../shared/components/AntdTypes';

const {TabPane} = Tabs;

const ADD_CLOUD_PROVIDER = 'addCloudProvider';

export default class Session extends Component {

  componentDidMount () {
    const {setLocalServerParams, getSavedSessions, setSavedServerParams, setVisibleProviders,
           getRunningSessions, bindWindowClose} = this.props;
    (async () => {
      try {
        bindWindowClose();
        await getSavedSessions();
        await setSavedServerParams();
        await setLocalServerParams();
        await setVisibleProviders();
        getRunningSessions();
      } catch (e) {
        console.error(e); // eslint-disable-line no-console
      }
    })();
  }

  async handleSelectServerTab (tab) {
    const {changeServerType, addCloudProvider} = this.props;
    if (tab === ADD_CLOUD_PROVIDER) {
      addCloudProvider();
      return;
    }
    await changeServerType(tab);
  }

  removeCloudProvider (providerName) {
    const {removeVisibleProvider} = this.props;
    removeVisibleProvider(providerName);
  }

  render () {
    const {newSessionBegan, savedSessions, tabKey, switchTabs,
           serverType,
           requestSaveAsModal, newSession, caps, capsUUID, saveSession,
           visibleProviders = [],
           isCapsDirty, sessionLoading, attachSessId, t} = this.props;

    const isAttaching = tabKey === 'attach';

    return [
      <Spin spinning={!!sessionLoading} key="main">
        <div className={SessionStyles.sessionContainer}>
          <div id='serverTypeTabs' className={SessionStyles.serverTab}>
            <Tabs activeKey={serverType} onChange={(tab) => this.handleSelectServerTab(tab)} className={SessionStyles.serverTabs}>
              {[
                <TabPane tab={t('Appium Server')} key="remote">
                  <ServerTabCustom {...this.props} />
                </TabPane>,
                ..._(visibleProviders).map((providerName) => {
                  const provider = CloudProviders[providerName];
                  if (!provider) {
                    return true;
                  }

                  return <TabPane key={providerName} tab={<div>{provider.tabhead()}</div>}>
                    {provider.tab(this.props)}
                  </TabPane>;
                }),
                <TabPane tab={<span className='addCloudProviderTab'>{ t('Select Cloud Providers') }</span>} key={ADD_CLOUD_PROVIDER}></TabPane>
              ]}
            </Tabs>
            <AdvancedServerParams {...this.props} />
          </div>


          {newSessionBegan && <div key={2}>
            <p>{t('sessionInProgress')}</p>
          </div>}

          {!newSessionBegan && <Tabs activeKey={tabKey} onChange={switchTabs} className={SessionStyles.scrollingTabCont}>
            <TabPane tab={t('Desired Capabilities')} key='new' className={SessionStyles.scrollingTab}>
              <NewSessionForm {...this.props} />
            </TabPane>
            <TabPane tab={t('Saved Capability Sets', {savedSessionsCount: savedSessions.length})} key='saved' className={SessionStyles.scrollingTab} disabled={savedSessions.length === 0}>
              <SavedSessions {...this.props} />
            </TabPane>
            <TabPane tab={t('Attach to Session')} key='attach' className={SessionStyles.scrollingTab}>
              <AttachToSession {...this.props} />
            </TabPane>
          </Tabs>}
          <div className={SessionStyles.sessionFooter}>
            <div className={SessionStyles.desiredCapsLink}>
              <a href="#" onClick={(e) => e.preventDefault() || shell.openExternal('https://github.com/appium/appium/blob/master/docs/en/writing-running-appium/caps.md')}>
                <LinkOutlined />&nbsp;
                {t('desiredCapabilitiesDocumentation')}
              </a>
            </div>
            { (!isAttaching && capsUUID) && <Button onClick={() => saveSession(caps, {uuid: capsUUID})} disabled={!isCapsDirty}>{t('Save')}</Button> }
            {!isAttaching && <Button onClick={requestSaveAsModal}>{t('saveAs')}</Button>}
            {!isAttaching && <Button type={BUTTON.PRIMARY} id='btnStartSession'
              onClick={() => newSession(caps)} className={SessionStyles['start-session-button']}>{t('startSession')}</Button>
            }
            {isAttaching &&
              <Button type={BUTTON.PRIMARY} disabled={!attachSessId} onClick={() => newSession(null, attachSessId)}>
                {t('attachToSession')}
              </Button>
            }
          </div>
        </div>
      </Spin>,
      <CloudProviderSelector {...this.props} />
    ];
  }
}
