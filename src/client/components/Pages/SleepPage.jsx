import { Typography } from '@material-ui/core';
import React from 'react';
import { ScreenBurnLine } from 'react-screen-burn';
import Layout from '../common/Layout';

const SleepPage = () => {
  return (
    <>
      <ScreenBurnLine retriggerTime={1800000} triggerTime={1800000} />
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
