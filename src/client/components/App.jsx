/* eslint-disable */
import React from 'react';
import { CssBaseline, Box } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';
import { connect } from 'react-redux';
import { Route } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';
import { AnimatedSwitch, spring } from 'react-router-transition';
import { makeStyles } from '@material-ui/core/styles';
import { hot } from 'react-hot-loader';

import HiddenCamera from './HiddenCamera';
import * as actions from '../store/actions';

import './app.css';
import SleepPage from './pages/SleepPage';
import FaceScanPage from './pages/FaceScanPage';
import NotRecognizedPage from './pages/NotRecognizedPage';
import SessionPage from './pages/SessionPage';
import HelpPage from './pages/HelpPage';
import history from '../utils/history';
import {
  PATH_FACE_SCAN,
  PATH_SLEEP,
  PATH_SESSION,
  PATH_NOT_RECOGNIZED,
  PATH_CREATE_USER,
  PATH_HELP
} from '../constants';
import CreateUserPage from './pages/CreateUserPage';
import { theme } from '../utils/theme';
import Test from './common/Test';
import ItemsDrawer from './common/ItemsDrawer';
import ItemDrawerButton from './common/ItemDrawerButton';

function mapStyles(styles) {
  return {
    opacity: styles.opacity,
    transform: `scale(${styles.scale})`
  };
}

function bounce(val) {
  return spring(val, {
    stiffness: 330,
    damping: 22
  });
}

const useStyles = makeStyles(theme => ({
  logButton: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 99999
  }
}));

const App = ({ appInit }) => {
  const classes = useStyles();
  React.useEffect(() => {
    appInit();
  });

  return (
    <React.Fragment>
      {/* <Test /> */}
      <CssBaseline />
      <HiddenCamera />
      <ThemeProvider theme={theme}>
        <ItemsDrawer />
        <div className={classes.logButton}>
          <ItemDrawerButton />
        </div>
        <Box
          display="flex"
          flex="1"
          justifyContent="center"
          alignItems="center"
          className="main-container"
        >
          <ConnectedRouter history={history}>
            <AnimatedSwitch
              atEnter={{ opacity: 0, scale: 1.2 }}
              atLeave={{ opacity: bounce(0), scale: bounce(0.8) }}
              atActive={{ opacity: bounce(1), scale: bounce(1) }}
              mapStyles={mapStyles}
              className="switch-wrapper"
            >
              <Route exact path="/" component={FaceScanPage} />
              <Route path={PATH_SLEEP} component={SleepPage} />
              <Route path={PATH_FACE_SCAN} component={FaceScanPage} />
              <Route path={PATH_SESSION} component={SessionPage} />
              <Route path={PATH_NOT_RECOGNIZED} component={NotRecognizedPage} />
              <Route path={PATH_CREATE_USER} component={CreateUserPage} />
              <Route path={PATH_HELP} component={HelpPage} />
            </AnimatedSwitch>
          </ConnectedRouter>
        </Box>
      </ThemeProvider>
    </React.Fragment>
  );
};

export default connect(
  null,
  { appInit: actions.appInit }
)(hot(module)(App));