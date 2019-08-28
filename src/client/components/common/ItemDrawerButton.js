import React, { useCallback } from 'react';
import { Fab, Fade } from '@material-ui/core';
import { List as ListIcon } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as actions from '../../store/actions';
import { selectIsItemsDrawerOpen } from '../../store/selectors';

const useStyles = makeStyles(theme => ({
  button: {
    margin: theme.spacing(1)
  }
}));

const ItemDrawerButton = ({ show, setDrawerOpen }) => {
  const classes = useStyles();
  return (
    <Fade in={show}>
      <Fab
        className={classes.button}
        onClick={useCallback(() => setDrawerOpen(true))}
      >
        <ListIcon />
      </Fab>
    </Fade>
  );
};

ItemDrawerButton.propTypes = {
  setDrawerOpen: PropTypes.func.isRequired,
  show: PropTypes.bool.isRequired
};

const mapStateToProps = state => {
  return {
    show: !selectIsItemsDrawerOpen(state)
  };
};

const mapDispatchToProps = {
  setDrawerOpen: actions.setItemsDrawerOpen
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ItemDrawerButton);
