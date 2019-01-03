import React from 'react';
import { render } from 'react-dom';
import Root from './containers/Root';
import { AppContainer } from 'react-hot-loader';
import Store from './store/configureStore';
import { initSentry } from '../shared/sentry';

const { history, configureStore } = Store;

const store = configureStore();

initSentry();

render(
  <AppContainer>
    <Root store={store} history={history} />
  </AppContainer>,
  document.getElementById('root')
);

if (module.hot) {
  module.hot.accept('./containers/Root', () => {
    // eslint-disable-next-line global-require
    const NextRoot = require('./containers/Root').default;
    render(
      <AppContainer>
        <NextRoot store={store} history={history} />
      </AppContainer>,
      document.getElementById('root')
    );
  });
}
