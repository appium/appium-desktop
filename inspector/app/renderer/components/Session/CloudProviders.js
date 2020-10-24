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
import ServerTabExperitest from './ServerTabExperitest';

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
import ExperitestLogo from '../../images/experitest_logo.svg';

const CloudProviders = {
  sauce: {
    tabhead: () => <span className={SessionStyles.tabText}><img src={SauceLogo} /></span>,
    tab: (props) => <ServerTabSauce {...props} />,
    logo: SauceLogo,
  },
  testobject: {
    tabhead: () => <span className={SessionStyles.tabText}><img src={TestObjectLogo} /></span>,
    tab: (props) => <ServerTabTestobject {...props} />,
    logo: TestObjectLogo,
  },
  headspin: {
    tabhead: () => <span className={SessionStyles.tabText}><img src={HeadSpinLogo} /></span>,
    tab: (props) => <ServerTabHeadspin {...props} />,
    logo: HeadSpinLogo,
  },
  browserstack: {
    tabhead: () => <span className={SessionStyles.tabText}><img src={BrowserStackLogo} /></span>,
    tab: (props) => <ServerTabBrowserstack {...props} />,
    logo: BrowserStackLogo,
  },
  bitbar: {
    tabhead: () => <span className={SessionStyles.tabText}><img src={BitBarLogo} /></span>,
    tab: (props) => <ServerTabBitbar {...props} />,
    logo: BitBarLogo,
  },
  kobiton: {
    tabhead: () => <span className={SessionStyles.tabText}><img src={KobitonLogo} /></span>,
    tab: (props) => <ServerTabKobiton {...props} />,
    logo: KobitonLogo,
  },
  perfecto: {
    tabhead: () => <span className={SessionStyles.tabText}><img src={PerfectoLogo} /></span>,
    tab: (props) => <ServerTabPerfecto {...props} />,
    logo: PerfectoLogo,
  },
  pcloudy: {
    tabhead: () => <span className={SessionStyles.tabText}><img src={PcloudyLogo} /></span>,
    tab: (props) => <ServerTabPcloudy {...props} />,
    logo: PcloudyLogo,
  },
  testingbot: {
    tabhead: () => <span className={SessionStyles.tabText}><img src={TestingBotLogo} /></span>,
    tab: (props) => <ServerTabTestingbot {...props} />,
    logo: TestingBotLogo,
  },
  experitest: {
    tabhead: () => <span className={SessionStyles.tabText}><img src={ExperitestLogo} /></span>,
    tab: (props) => <ServerTabExperitest {...props} />,
    logo: ExperitestLogo,
  },
};

export default CloudProviders;