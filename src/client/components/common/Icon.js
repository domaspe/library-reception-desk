import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import classNames from 'classnames';

const useStyles = makeStyles(() => ({
  icon: {
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center'
  }
}));

const Icon = ({ src, size, className, ...props }) => {
  const classes = useStyles();
  return (
    <div
      className={classNames(classes.icon, className)}
      style={{ backgroundImage: `url("${src}")`, width: size, height: size }}
      {...props}
    />
  );
};

Icon.propTypes = {
  src: PropTypes.string.isRequired,
  size: PropTypes.number.isRequired,
  className: PropTypes.string
};

export default Icon;
