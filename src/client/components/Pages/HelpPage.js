import React from 'react';
import { Typography } from '@material-ui/core';
import Layout from '../common/Layout';
import HelpOptions from '../common/HelpOptions';

const HelpPage = () => {
  return (
    <Layout
      actions={<HelpOptions />}
      iconSrc="/assets/faceid-sad.svg"
      titleComponent={
        <Typography variant="h6" color="textPrimary" align="center">
          Why we couldn’t recognize your face?
        </Typography>
      }
    >
      <Typography color="textPrimary">
        This could be for a number of reasons, here are a few:
        <ul>
          <li>You’re not registered in the system yet - Create new user </li>
          <li>
            You haven’t allowed your face to be used for facial recognition. You
            can enable it from user profile once you’re logged in.
          </li>
          <li>
            Camera failed to recognize your face because of technical issues,
            poor lighting conditions or other reasons.
          </li>
          <li>
            If it’s not any of the above, try looking straight at the camera
            from about 30-50cm distance. Sometimes looking at the camera
            off-angle might cause
          </li>
        </ul>
      </Typography>
    </Layout>
  );
};

export default HelpPage;
