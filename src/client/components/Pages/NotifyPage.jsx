import React from 'react';
import { Typography } from '@material-ui/core';
import { connect } from 'react-redux';
import Layout from '../common/Layout';
import { selectIsNotifyMessage } from '../../store/selectors';

const NotifyPage = ({ text }) => (
  <Layout
    iconSrc="/assets/qr.svg"
    titleComponent={
      <Typography color="textPrimary" align="center">
        {text}
      </Typography>
    }
  />
);

const mapStateToProps = state => ({
  text: selectIsNotifyMessage(state)
});

export default connect(mapStateToProps)(NotifyPage);
