import React from 'react';
import { render } from 'react-dom';
import Root from './containers/Root';
import ErrorBoundary from '../../gui-common/components/ErrorBoundary/ErrorBoundary';
import Store from './store/configureStore';

const { history, configureStore } = Store;

const store = configureStore();

render(
  <ErrorBoundary>
    <Root store={store} history={history} />
  </ErrorBoundary>,
  document.getElementById('root')
);

if (module.hot) {
  module.hot.accept();
}
