import React from 'react';
import { Typography, makeStyles } from '@material-ui/core';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Layout from '../common/Layout';
import { selectNotifyAssignItemSuccess } from '../../store/selectors';
import { useIconAnimation } from '../../utils/hooks';
import HelpButton from '../common/HelpButton';
import ChooseUserButton from '../common/ChooseUserButton';
import CreateNewUserButton from '../common/CreateNewUserButton';

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

const FaceScanPage = ({ assignItemSuccess }) => {
  const classes = useStyles();
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

FaceScanPage.propTypes = {
  assignItemSuccess: PropTypes.bool.isRequired
};

const mapSateToProps = state => ({
  assignItemSuccess: selectNotifyAssignItemSuccess(state)
});

export default connect(mapSateToProps)(FaceScanPage);
