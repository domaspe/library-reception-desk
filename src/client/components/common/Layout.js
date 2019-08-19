import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';

const XS = 7;

const useStyles = makeStyles(() => ({
  icon: {
    height: 100,
    width: 100,
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    margin: '0 auto'
  },
  iconSmall: {
    height: 40,
    width: 40
  }
}));

const Layout = ({ iconSrc, children, actions, titleComponent }) => {
  const classes = useStyles();

  return (
    <Grid container spacing={2} justify="center" alignItems="center">
      {iconSrc && (
        <Grid
          item
          xs={XS}
          justify="center"
          alignItems="center"
          container
          spacing={2}
        >
          <Grid item xs={12}>
            <div
              className={classes.icon}
              style={{ backgroundImage: `url("${iconSrc}")` }}
            />
          </Grid>
        </Grid>
      )}
      {titleComponent && (
        <Grid item xs={XS} container justify="center" alignItems="center">
          {titleComponent}
        </Grid>
      )}
      {children && (
        <Grid item xs={XS} container justify="center" alignItems="center">
          {children}
        </Grid>
      )}
      {actions && (
        <Grid item xs={XS} container justify="center" alignItems="center">
          {actions}
        </Grid>
      )}
    </Grid>
  );
};

Layout.propTypes = {
  iconSrc: PropTypes.string.isRequired,
  titleComponent: PropTypes.node,
  children: PropTypes.node,
  actions: PropTypes.node
};

export default Layout;
