import React from 'react';
import { connect } from 'react-redux';
import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import * as actions from '../../store/actions';

const useStyles = makeStyles(theme => ({
  button: {
    margin: theme.spacing(1)
  },
  formControl: {
    minWidth: 220
  }
}));

const CreateNewUserButton = ({ onCreate }) => {
  const classes = useStyles();
  return (
    <Button
      variant="contained"
      color="primary"
      onClick={onCreate}
      className={classes.button}
    >
      Create new user
    </Button>
  );
};

CreateNewUserButton.propTypes = {
  onCreate: PropTypes.func.isRequired
};

const mapDispatchToProps = {
  onCreate: actions.createUser
};

export default connect(
  null,
  mapDispatchToProps
)(CreateNewUserButton);
