import React from 'react';
import { render } from 'react-dom';
import Root from './containers/Root';
import ErrorBoundary from '../../../shared/components/ErrorBoundary/ErrorBoundary';
import Store from './store/configureStore';

const { history, configureStore } = Store;

const store = configureStore();

if (module.hot) {
  module.hot.accept();
}

render(
  <ErrorBoundary>
    <Root store={store} history={history} />
  </ErrorBoundary>,
  document.getElementById('root')
);
