import React from 'react';
import { Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Layout from '../common/Layout';
import { selectNotifyAssignItemAuccess } from '../../store/selectors';
import { useIconAnimation } from '../../utils/hooks';
import HelpButton from '../common/HelpButton';
import ChooseUserButton from '../common/ChooseUserButton';

const FaceScanPage = ({ assignItemSuccess }) => {
  const [animateIcon, onIconAnimationEnd] = useIconAnimation(assignItemSuccess);
  return (
    <Layout
      iconSrc="/assets/faceid-happy.svg"
      animateIcon={animateIcon}
      onIconAnimationEnd={onIconAnimationEnd}
      actions={
        <>
          <ChooseUserButton />
          <HelpButton />
        </>
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
  assignItemSuccess: PropTypes.bool.isRequired
};

const mapSateToProps = state => ({
  assignItemSuccess: selectNotifyAssignItemAuccess(state)
});

export default connect(mapSateToProps)(FaceScanPage);
