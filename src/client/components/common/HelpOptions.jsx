import React from 'react';
import { connect } from 'react-redux';
import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import * as actions from '../../store/actions';
import ChooseUserButton from './ChooseUserButton';

const useStyles = makeStyles(theme => ({
  button: {
    margin: theme.spacing(1)
  },
  formControl: {
    minWidth: 220
  }
}));

const HelpOptions = ({ onClose, onCreate }) => {
  const classes = useStyles();
  return (
    <>
      <ChooseUserButton />
      <Button
        variant="contained"
        color="primary"
        onClick={onCreate}
        className={classes.button}
      >
        Create new user
      </Button>
      <Button color="primary" onClick={onClose} className={classes.button}>
        Try again
      </Button>
    </>
  );
};

HelpOptions.propTypes = {
  onClose: PropTypes.func.isRequired,
  onCreate: PropTypes.func.isRequired
};

const mapDispatchToProps = {
  onClose: actions.startScanningFaces,
  onCreate: actions.createUser
};

export default connect(
  null,
  mapDispatchToProps
)(HelpOptions);
