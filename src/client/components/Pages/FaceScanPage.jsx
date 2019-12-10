import { makeStyles, Typography } from '@material-ui/core';
import React from 'react';
import { useSelector } from 'react-redux';
import { selectNotifyAssignItemSuccess } from '../../store/selectors';
import { useIconAnimation } from '../../utils/hooks';
import ChooseUserButton from '../common/ChooseUserButton';
import CreateNewUserButton from '../common/CreateNewUserButton';
import HelpButton from '../common/HelpButton';
import Layout from '../common/Layout';

const useStyles = makeStyles(() => ({
  buttonContainer: {
    display: 'flex',
    flexDirection: 'column'
  },
  formControl: {
    minWidth: 220
  },
  buttonRow: {
    display: 'flex',
    justifyContent: 'center'
  }
}));

const FaceScanPage = () => {
  const classes = useStyles();
  const assignItemSuccess = useSelector(selectNotifyAssignItemSuccess);
  const [animateIcon, onIconAnimationEnd] = useIconAnimation(assignItemSuccess);
  return (
    <Layout
      iconSrc="/assets/faceid-happy.svg"
      animateIcon={animateIcon}
      onIconAnimationEnd={onIconAnimationEnd}
      actions={
        <div className={classes.buttonContainer}>
          <div className={classes.buttonRow}>
            <ChooseUserButton />
            <CreateNewUserButton />
          </div>
          <HelpButton />
        </div>
      }
      titleComponent={
        <Typography variant="h6" color="textPrimary" align="center">
          Look straight into the camera to get started.
        </Typography>
      }
    />
  );
};

export default FaceScanPage;
