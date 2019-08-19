/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@material-ui/styles';
import { createMuiTheme } from '@material-ui/core';

import App from './components/App';
import store from './store';

ReactDOM.render(
  <Provider store={store}>
    <ThemeProvider theme={createMuiTheme()}>
      <App />
    </ThemeProvider>
  </Provider>,
  document.getElementById('root')
);
