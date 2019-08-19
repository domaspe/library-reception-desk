import React from 'react';
import { IconButton, Typography } from '@material-ui/core';
import { HelpOutline as HelpOutlineIcon } from '@material-ui/icons';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as actions from '../../store/actions';
import Layout from '../common/Layout';

const FaceScanPage = ({ help, ses }) => (
  <Layout
    iconSrc="/assets/faceid-happy.svg"
    actions={
      <IconButton
        aria-label="remove item"
        onClick={() => /* TODO: temp: help() */ ses('dpet')}
        color="primary"
      >
        <HelpOutlineIcon />
      </IconButton>
    }
    titleComponent={
      <Typography variant="h6" color="textPrimary" align="center">
        Look straight into the camera to get started.
      </Typography>
    }
  />
);

FaceScanPage.propTypes = {
  help: PropTypes.func.isRequired
};

const mapDispatchToProps = {
  help: actions.help,
  // TODO: temp
  ses: actions.startSession
};

export default connect(
  null,
  mapDispatchToProps
)(FaceScanPage);
