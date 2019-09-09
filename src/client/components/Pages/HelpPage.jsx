import React from 'react';
import { Typography } from '@material-ui/core';
import { connect } from 'react-redux';
import Layout from '../common/Layout';
import * as actions from '../../store/actions';
import CloseButton from '../common/CloseButton';

const HelpPage = ({ onClose }) => {
  return (
    <Layout
      iconSrc="/assets/faceid-sad.svg"
      titleComponent={
        <Typography variant="h6" color="textPrimary" align="center">
          Why we couldn’t recognize your face?
        </Typography>
      }
    >
      <CloseButton onClick={onClose} />
      <Typography color="textPrimary">
        This could be for a number of reasons, here are a few:
      </Typography>
      <ul>
        <Typography color="textPrimary" component="li">
          You’re not registered in the system yet - Create new user
        </Typography>
        <Typography color="textPrimary" component="li">
          You haven’t allowed your face to be used for facial recognition. You
          can enable it from user profile once you’re logged in.
        </Typography>
        <Typography color="textPrimary" component="li">
          Camera failed to recognize your face because of technical issues, poor
          lighting conditions or other reasons.
        </Typography>
        <Typography color="textPrimary" component="li">
          If it’s not any of the above, try looking straight at the camera from
          about 30-50cm distance. Sometimes looking at the camera off-angle
          might cause
        </Typography>
      </ul>
    </Layout>
  );
};

const mapDispatchToProps = {
  onClose: actions.startScanningFaces
};

export default connect(
  null,
  mapDispatchToProps
)(HelpPage);
