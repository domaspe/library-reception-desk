import React, { useCallback } from 'react';
import { Button, Fab, Fade } from '@material-ui/core';
import { List as ListIcon } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as actions from '../../store/actions';
import { selectIsLogPage } from '../../store/selectors';

const useStyles = makeStyles(theme => ({
  button: {
    margin: theme.spacing(1)
  }
}));

const LogButton = ({ show, onClick }) => {
  const classes = useStyles();
  return (
    <Fade in={show}>
      <Fab className={classes.button} onClick={onClick}>
        <ListIcon />
      </Fab>
    </Fade>
  );
};

LogButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  show: PropTypes.string
};

const mapStateToProps = state => {
  return {
    show: !selectIsLogPage(state)
  };
};

const mapDispatchToProps = {
  onClick: actions.itemLog
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LogButton);
