import React, { useCallback } from 'react';
import { Fade, IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as actions from '../../store/actions';
import { selectIsItemsDrawerOpen, selectIsHibernatedPage } from '../../store/selectors';

const useStyles = makeStyles(theme => ({
  button: {
    margin: theme.spacing(1)
  }
}));

const DrawerButton = ({ show, setDrawerOpen }) => {
  const classes = useStyles();
  return (
    <Fade in={show}>
      <IconButton className={classes.button} onClick={useCallback(() => setDrawerOpen(true))}>
        <MenuIcon fontSize="large" />
      </IconButton>
    </Fade>
  );
};

DrawerButton.propTypes = {
  setDrawerOpen: PropTypes.func.isRequired,
  show: PropTypes.bool.isRequired
};

const mapStateToProps = state => {
  return {
    show: !selectIsItemsDrawerOpen(state) && !selectIsHibernatedPage(state)
  };
};

const mapDispatchToProps = {
  setDrawerOpen: actions.setItemsDrawerOpen
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DrawerButton);
