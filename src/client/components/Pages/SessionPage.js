import React from 'react';
import PropTypes from 'prop-types';
import { Button, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
// eslint-disable-next-line import/no-extraneous-dependencies
import {
  selectActiveUserId,
  selectNotifyAssignItemAuccess
} from '../../store/selectors';
import * as actions from '../../store/actions';
import Layout from '../common/Layout';
import { useIconAnimation } from '../../utils/hooks';
import ItemList from '../common/ItemList';
import LogButton from '../common/LogButton';

const useStyles = makeStyles(() => ({
  name: {
    fontWeight: 'bold'
  }
}));

const SessionPage = ({ userId, onLogout, assignItemSuccess }) => {
  const classes = useStyles();
  const [animateIcon, onIconAnimationEnd] = useIconAnimation(assignItemSuccess);

  return (
    <Layout
      iconSrc="/assets/qr.svg"
      animateIcon={animateIcon}
      onIconAnimationEnd={onIconAnimationEnd}
      titleComponent={
        <>
          <Typography
            variant="h4"
            color="textPrimary"
            align="center"
            className={classes.greeting}
          >
            Hey there,&nbsp;
          </Typography>
          <Typography
            variant="h4"
            color="textPrimary"
            align="center"
            className={classes.name}
          >
            {userId}
          </Typography>
        </>
      }
      actions={
        <>
          <Button variant="contained" color="primary" onClick={onLogout}>
            End session
          </Button>
          <LogButton text="Add item manually" />
        </>
      }
    >
      <Typography color="textPrimary" gutterBottom>
        Below are the devices that you’ve taken out. If you want to take/return
        a device, face the QR code on the back of the device towards the camera.
      </Typography>
      <ItemList show="taken" />
    </Layout>
  );
};

SessionPage.propTypes = {
  onLogout: PropTypes.func.isRequired,
  userId: PropTypes.string.isRequired
};

const mapStateToProps = state => {
  const userId = selectActiveUserId(state);
  return {
    userId,
    assignItemSuccess: selectNotifyAssignItemAuccess(state)
  };
};

const mapDispatchToProps = {
  tryAssignItem: actions.tryAssignItem,
  onLogout: actions.endSession
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SessionPage);
