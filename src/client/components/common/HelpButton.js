import React from 'react';
import { IconButton, Button } from '@material-ui/core';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as actions from '../../store/actions';

const useStyles = makeStyles(theme => ({
  button: {
    margin: theme.spacing(1)
  }
}));

const HelpButton = ({ help }) => {
  const classes = useStyles();
  return (
    <Button
      onClick={help}
      color="primary"
      size="small"
      className={classes.button}
    >
      Need help?
    </Button>
  );
};

HelpButton.propTypes = {
  help: PropTypes.func.isRequired
};

const mapDispatchToProps = {
  help: actions.help
};

export default connect(
  null,
  mapDispatchToProps
)(HelpButton);
