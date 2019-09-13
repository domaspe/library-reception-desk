import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles(theme => ({
  close: {
    margin: theme.spacing(1),
    position: 'absolute',
    top: 0,
    right: 0
  }
}));

const CloseButton = ({ onClick }) => {
  const classes = useStyles();
  return (
    <IconButton className={classes.close} size="medium" color="primary" onClick={onClick}>
      <CloseIcon fontSize="large" />
    </IconButton>
  );
};

CloseButton.propTypes = {
  onClick: PropTypes.func.isRequired
};

export default CloseButton;
