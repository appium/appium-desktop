import React, { Suspense } from 'react';
import { Switch, Route } from 'react-router';
import App from './containers/App';
import SessionPage from './containers/SessionPage';
import InspectorPage from './containers/InspectorPage';
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
        <Route exact path="/" component={SessionPage} />
        <Route path="/session" component={SessionPage} />
        <Route path="/inspector" component={InspectorPage} />
      </Switch>
    </App>
  </Suspense>
);
