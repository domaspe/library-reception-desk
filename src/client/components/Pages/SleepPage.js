import React from 'react';
import { Typography } from '@material-ui/core';
import Layout from '../common/Layout';

const SleepPage = () => (
  <Layout
    iconSrc="/assets/sleep.svg"
    titleComponent={
      <Typography color="textPrimary" align="center">
        Press any key to wake up
      </Typography>
    }
  />
);

export default SleepPage;
