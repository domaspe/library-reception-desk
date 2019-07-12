/* eslint-disable no-nested-ternary */
import React from 'react';
import { connect } from 'react-redux';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { selectFaceMatchLabel, selectIsFaceDetected } from '../store/selectors';

const useStyles = makeStyles(theme => ({
  container: {
    margin: theme.spacing(1)
  }
}));

const MatchInfo = ({ matchLabel, isFaceDetected }) => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      {matchLabel ? (
        <Typography variant="body2" align="center">
          {matchLabel}
        </Typography>
      ) : isFaceDetected ? (
        <Typography variant="body2" align="center">
          Unidentified
        </Typography>
      ) : (
        <Typography variant="body2" align="center">
          No face detected...
        </Typography>
      )}
    </div>
  );
};

export default connect(state => ({
  isFaceDetected: selectIsFaceDetected(state),
  matchLabel: selectFaceMatchLabel(state)
}))(MatchInfo);
