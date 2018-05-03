import React, { Component } from 'react';
import ServerTabAutomatic from './ServerTabAutomatic';
import ServerTabSauce from './ServerTabSauce';
import ServerTabCustom from './ServerTabCustom';
import ServerTabTestobject from './ServerTabTestobject';
import ServerTabBrowserstack from './ServerTabBrowserstack';
import ServerTabHeadspin from './ServerTabHeadspin';
import SessionStyles from './Session.css';
import AdvancedServerParams from './AdvancedServerParams';
import { ServerTypes } from '../../actions/Session';
import { Tabs } from 'antd';

const {TabPane} = Tabs;

export default class ServerTypeTabs extends Component {

  render () {
    const {server, serverType, changeServerType} = this.props;

    const sauceTabHead = <span className={SessionStyles.tabText}><img src="images/sauce_logo.svg" /></span>;
    const testObjectTabHead = <span className={SessionStyles.tabText}><img src="images/testobject_logo.svg" /></span>;
    const headspinTabHead = <span className={SessionStyles.tabText}><img src="images/headspin_logo.svg" /></span>;
    const browserstackTabHead = <span className={SessionStyles.tabText}><img src="images/browserstack_logo.svg" /></span>;

    return <div id='serverTypeTabs'>
      <Tabs activeKey={serverType} onChange={changeServerType} className={SessionStyles.serverTabs}>
        <TabPane disabled={!server.local.port} tab='Automatic Server' key={ServerTypes.local}>
          <ServerTabAutomatic {...this.props} />
        </TabPane>
        <TabPane tab='Custom Server' key={ServerTypes.remote}>
          <ServerTabCustom {...this.props} />
        </TabPane>
        <TabPane tab={sauceTabHead} key={ServerTypes.sauce}>
          <ServerTabSauce {...this.props} />
        </TabPane>
        <TabPane tab={testObjectTabHead} key={ServerTypes.testobject}>
          <ServerTabTestobject {...this.props} />
        </TabPane>
        <TabPane tab={headspinTabHead} key={ServerTypes.headspin}>
          <ServerTabHeadspin {...this.props} />
        </TabPane>
        <TabPane tab={browserstackTabHead} key={ServerTypes.browserstack}>
          <ServerTabBrowserstack {...this.props} />
        </TabPane>
      </Tabs>
      <AdvancedServerParams {...this.props} />
    </div>;
  }
}
