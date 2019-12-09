import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import Icon from './Icon';

const useStyles = makeStyles(theme => ({
  icon: {
    margin: '0 auto',
    minHeight: 60
  },
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    width: '90vw',
    minWidth: 400,
    maxWidth: 900,
    margin: '0 auto',
    padding: theme.spacing(2),
    height: '100vh'
  },
  box: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: theme.spacing(2),
    width: '100%'
  },
  children: {
    minHeight: '30vh',
    flexDirection: 'column'
  },
  logButton: {
    position: 'absolute'
  }
}));

const Layout = ({
  iconSrc,
  children,
  actions,
  titleComponent,
  animateIcon,
  onIconAnimationEnd
}) => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      {iconSrc && (
        <Icon
          size={60}
          src={iconSrc}
          className={classNames(classes.icon, 'animated', {
            bounce: animateIcon
          })}
          onAnimationEnd={onIconAnimationEnd}
        />
      )}
      {titleComponent && <div className={classes.box}>{titleComponent}</div>}
      {children && <div className={`${classes.box} ${classes.children}`}>{children}</div>}
      {actions && <div className={classes.box}>{actions}</div>}
    </div>
  );
};

Layout.propTypes = {
  iconSrc: PropTypes.string.isRequired,
  titleComponent: PropTypes.node,
  children: PropTypes.node,
  actions: PropTypes.node
};

export default Layout;
