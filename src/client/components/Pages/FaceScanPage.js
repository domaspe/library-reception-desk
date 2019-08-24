import React from 'react';
import { IconButton, Typography } from '@material-ui/core';
import { HelpOutline as HelpOutlineIcon } from '@material-ui/icons';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as actions from '../../store/actions';
import Layout from '../common/Layout';
import { selectNotifyAssignItemAuccess } from '../../store/selectors';
import { useIconAnimation } from '../../utils/hooks';

const FaceScanPage = ({ help, assignItemSuccess }) => {
  const [animateIcon, onIconAnimationEnd] = useIconAnimation(assignItemSuccess);
  return (
    <Layout
      iconSrc="/assets/faceid-happy.svg"
      animateIcon={animateIcon}
      onIconAnimationEnd={onIconAnimationEnd}
      actions={
        <IconButton
          aria-label="remove item"
          onClick={() => help()}
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
};

FaceScanPage.propTypes = {
  help: PropTypes.func.isRequired
};

const mapSateToProps = state => ({
  assignItemSuccess: selectNotifyAssignItemAuccess(state)
});

const mapDispatchToProps = {
  help: actions.help
};

export default connect(
  mapSateToProps,
  mapDispatchToProps
)(FaceScanPage);
