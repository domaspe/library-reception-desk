import { Typography } from '@material-ui/core';
import React from 'react';
import { ScreenBurnLine } from 'react-screen-burn';
import Layout from '../common/Layout';

const SleepPage = () => {
  return (
    <>
      <ScreenBurnLine />
      <Layout
        iconSrc="/assets/sleep.svg"
        titleComponent={
          <Typography color="textPrimary" align="center">
            Press any key to wake up
          </Typography>
        }
      />
    </>
  );
};

export default SleepPage;
