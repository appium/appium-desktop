import React, { Suspense } from 'react';
import { Switch, Route } from 'react-router';
import App from './containers/App';
import StartServerPage from './containers/StartServerPage';
import ServerMonitorPage from './containers/ServerMonitorPage';
import ConfigPage from './containers/ConfigPage';
import Spinner from '../../../shared/components/Spinner/Spinner';
import { ipcRenderer } from 'electron';
import i18n from '../configs/i18next.config.renderer';

ipcRenderer.on('appium-language-changed', (event, message) => {
  if (i18n.language !== message.language) {
    i18n.changeLanguage(message.language);
  }
});

export default () => (
  <Suspense fallback={<Spinner />}>
    <App>
      <Switch>
        <Route exact path="/" component={StartServerPage} />
        <Route path="/monitor" component={ServerMonitorPage} />
        <Route path="/config" component={ConfigPage} />
      </Switch>
    </App>
  </Suspense>
);
