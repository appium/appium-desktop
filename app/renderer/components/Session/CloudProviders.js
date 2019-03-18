import React from 'react';
import ServerTabTestobject from './ServerTabTestobject';
import ServerTabHeadspin from './ServerTabHeadspin';
import ServerTabBrowserstack from './ServerTabBrowserstack';
import ServerTabBitbar from './ServerTabBitbar';
import ServerTabKobiton from './ServerTabKobiton';
import ServerTabPerfecto from './ServerTabPerfecto';
import ServerTabPcloudy from './ServerTabPcloudy';
import ServerTabSauce from './ServerTabSauce';
import ServerTabTestingbot from './ServerTabTestingbot';

import SessionStyles from './Session.css';

// ParcelJS handles image loading by exporting a path to the image
import SauceLogo from '../../images/sauce_logo.svg';
import TestObjectLogo from '../../images/testobject_logo.svg';
import HeadSpinLogo from '../../images/headspin_logo.svg';
import BrowserStackLogo from '../../images/browserstack_logo.svg';
import BitBarLogo from '../../images/bitbar_logo.svg';
import KobitonLogo from '../../images/kobiton_logo.svg';
import PerfectoLogo from '../../images/perfecto_logo.png';
import PcloudyLogo from '../../images/pcloudy_logo.svg';
import TestingBotLogo from '../../images/testingbot_logo.svg';

export default {
  sauce: {
    tabhead: () => <span className={SessionStyles.tabText}><img src={SauceLogo} /></span>,
    tab: props => <ServerTabSauce {...props} />,
  },
  testobject: {
    tabhead: () => <span className={SessionStyles.tabText}><img src={TestObjectLogo} /></span>,
    tab: props => <ServerTabTestobject {...props} />,
  },
  headspin: {
    tabhead: () => <span className={SessionStyles.tabText}><img src={HeadSpinLogo} /></span>,
    tab: props => <ServerTabHeadspin {...props} />,
  },
  browserstack: {
    tabhead: () => <span className={SessionStyles.tabText}><img src={BrowserStackLogo} /></span>,
    tab: props => <ServerTabBrowserstack {...props} />,
  },
  bitbar: {
    tabhead: () => <span className={SessionStyles.tabText}><img src={BitBarLogo} /></span>,
    tab: props => <ServerTabBitbar {...props} />,
  },
  kobiton: {
    tabhead: () => <span className={SessionStyles.tabText}><img src={KobitonLogo} /></span>,
    tab: props => <ServerTabKobiton {...props} />,
  },
  perfecto: {
    tabhead: () => <span className={SessionStyles.tabText}><img src={PerfectoLogo} /></span>,
    tab: props => <ServerTabPerfecto {...props} />,
  },
  pcloudy: {
    tabhead: () => <span className={SessionStyles.tabText}><img src={PcloudyLogo} /></span>,
    tab: props => <ServerTabPcloudy {...props} />,
  },
  testingbot: {
    tabhead: () => <span className={SessionStyles.tabText}><img src={TestingBotLogo} /></span>,
    tab: props => <ServerTabTestingbot {...props} />},
};

/*

<TabPane tab={sauceTabHead} key={ServerTypes.sauce}>
  <ServerTabSauce {...props} />
</TabPane>
<TabPane tab={testObjectTabHead} key={ServerTypes.testobject}>
  <ServerTabTestobject {...props} />
</TabPane>
<TabPane tab={headspinTabHead} key={ServerTypes.headspin}>
  <ServerTabHeadspin {...props} />
</TabPane>
<TabPane tab={browserstackTabHead} key={ServerTypes.browserstack}>
  <ServerTabBrowserstack {...props} />
</TabPane>
<TabPane tab={bitbarTabHead} key={ServerTypes.bitbar}>
  <ServerTabBitbar {...props} />
</TabPane>
<TabPane tab={kobitonTabHead} key={ServerTypes.kobiton}>
  <ServerTabKobiton {...props} />
</TabPane>
<TabPane tab={perfectoTabHead} key={ServerTypes.perfecto}>
  <ServerTabPerfecto {...props} />
</TabPane>
<TabPane tab={pcloudyTabHead} key={ServerTypes.pcloudy}>
  <ServerTabPcloudy {...props} />
</TabPane>
*/