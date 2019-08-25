import React, { useCallback } from 'react';
import { Button, Fab } from '@material-ui/core';
import { List as ListIcon } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as actions from '../../store/actions';

const useStyles = makeStyles(theme => ({
  button: {
    margin: theme.spacing(1)
  }
}));

const LogButton = ({ text, onClick, showAll }) => {
  const classes = useStyles();
  const handleClick = useCallback(() => onClick(showAll));
  return text ? (
    <Button color="primary" onClick={handleClick} className={classes.button}>
      {text}
    </Button>
  ) : (
    <Fab className={classes.button} onClick={handleClick}>
      <ListIcon />
    </Fab>
  );
};

LogButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  text: PropTypes.string
};

const mapDispatchToProps = {
  onClick: actions.itemLog
};

export default connect(
  null,
  mapDispatchToProps
)(LogButton);
