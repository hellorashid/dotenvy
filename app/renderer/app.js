import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { createMemoryHistory } from 'history';
import routes from './routes';
import configureStore from './store';
import { Grommet } from 'grommet';

const syncHistoryWithStore = (store, history) => {
  const { router } = store.getState();
  if (router && router.location) {
    history.replace(router.location);
  }
};

const initialState = {};
const routerHistory = createMemoryHistory();
const store = configureStore(initialState, routerHistory);
syncHistoryWithStore(store, routerHistory);

const rootElement = document.querySelector(document.currentScript.getAttribute('data-container'));

const theme = {
  global: {
    font: {
      family: 'Roboto',
      size: '14px',
      height: '20px',
    },
    elevation: {
      light: {
        medium: '0px 2px 4px -1px rgba(7, 190, 184, 0.1), 0px 4px 5px 0px rgba(7, 190, 184, 0.14), 0px 1px 10px 0px rgba(7, 190, 184, 0.12)',
      },
    }
  }
}

ReactDOM.render(
  <Provider store={store}>
    <Grommet  theme={theme}>
    <ConnectedRouter history={routerHistory}>{routes}</ConnectedRouter>
    </Grommet>
  </Provider>,
  rootElement,
);
