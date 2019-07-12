/* eslint-disable */
import React from 'react';
import { SvgIcon, Grid, Paper, CssBaseline, Card } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';

import DetectionCamera from './components/DetectionCamera';
import MatchInfo from './components/MatchInfo';
import ControlPanel from './components/ControlPanel/ControlPanel';
import ConsecutiveSnackbars from './components/ConsecutiveSnackbars';
import Items from './components/Items';
import * as actions from './store/actions';

import './app.css';

const CAMERA_WIDTH = 300;
const TABLE_WIDTH = 300;

const useStyles = makeStyles(theme => {
  const cameraContainerWidth = CAMERA_WIDTH + theme.spacing(4);
  const minDesktopWidth = cameraContainerWidth + TABLE_WIDTH;
  return {
    root: {
      height: '100vh'
    },
    paper: {
      margin: theme.spacing(2, 2),
      marginTop: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    },
    avatarContainer: {
      display: 'flex',
      flex: 1,
      width: '100%',
      margin: theme.spacing(1),
      justifyContent: 'center',
      alignItems: 'center'
    },
    avatar: {
      backgroundColor: theme.palette.secondary.main
    },
    cameraContaner: {
      width: cameraContainerWidth,
      [theme.breakpoints.down(minDesktopWidth)]: {
        width: '100%'
      }
    },
    tableContainer: {
      [theme.breakpoints.up(minDesktopWidth)]: {
        overflow: 'auto'
      },
      minWidth: TABLE_WIDTH
    },
    camera: {
      margin: theme.spacing(2)
    }
  };
});

const QRIcon = props => (
  <SvgIcon {...props}>
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
      <path d="M19 2c1.654 0 3 1.346 3 3v14c0 1.654-1.346 3-3 3h-14c-1.654 0-3-1.346-3-3v-14c0-1.654 1.346-3 3-3h14zm0-2h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-8 8h-1v-2h1v1h2v1h-1v1h-1v-1zm2 12v-1h-1v1h1zm-1-15v-1h-2v1h1v1h1v-1zm8-1v6h-1v-1h-4v-5h5zm-1 4v-3h-3v3h3zm-14 2h-1v1h2v-1h-1zm0 3h1v1h1v-3h-1v1h-2v2h1v-1zm5 1v2h1v-2h-1zm4-10h-1v3h1v-3zm0 5v-1h-1v1h1zm3-2h1v-1h-1v1zm-10-1h-1v1h1v-1zm2-2v5h-5v-5h5zm-1 1h-3v3h3v-3zm9 5v1h-1v-1h-2v1h-1v-1h-3v-1h-1v1h-1v1h1v2h1v-1h1v2h1v-2h3v1h-2v1h2v1h1v-3h1v1h1v2h1v-1h1v-1h-1v-1h-1v-1h1v-1h-2zm-11 8h1v-1h-1v1zm-2-3h5v5h-5v-5zm1 4h3v-3h-3v3zm12-3v-1h-1v1h1zm0 1h-1v1h-1v-1h-1v-1h1v-1h-2v-1h-1v2h-1v1h-1v3h1v-1h1v-1h2v2h1v-1h1v1h2v-1h1v-1h-2v-1zm-9-3h1v-1h-1v1zm10 2v1h1v1h1v-3h-1v1h-1zm2 4v-1h-1v1h1zm0-8v-1h-1v1h1z" />
    </svg>
  </SvgIcon>
);

const App = ({ appInit }) => {
  React.useEffect(() => {
    appInit();
  });

  const classes = useStyles();
  return (
    <React.Fragment>
      <CssBaseline />
      <ConsecutiveSnackbars />
      <Grid container component="main" className={classes.root}>
        <Grid item component={Paper} elevation={6} square className={classes.cameraContaner}>
          <div className={classes.paper}>
            <Card className={classes.camera}>
              <DetectionCamera width={CAMERA_WIDTH} />
              <MatchInfo />
            </Card>
            <div style={{ width: CAMERA_WIDTH }}>
              <ControlPanel />
            </div>
          </div>
        </Grid>
        <Grid item xs className={classes.tableContainer}>
          <Items />
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default connect(
  null,
  { appInit: actions.appInit }
)(App);
