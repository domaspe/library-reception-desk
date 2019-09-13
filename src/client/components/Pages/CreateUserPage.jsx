import React, { useState, useCallback, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  CircularProgress,
  TextField,
  Button,
  makeStyles,
  FormControlLabel,
  Checkbox,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Zoom
} from '@material-ui/core';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import NavigateBefore from '@material-ui/icons/NavigateBefore';
import * as selectors from '../../store/selectors';
import * as actions from '../../store/actions';
import Layout from '../common/Layout';
import CloseButton from '../common/CloseButton';
import Video from '../common/Video';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1
  },
  inputContainer: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column'
  },
  button: {
    margin: theme.spacing(1)
  },
  rightIcon: {
    marginLeft: theme.spacing(1)
  },
  leftIcon: {
    marginRight: theme.spacing(1)
  },
  stepper: {
    marginBottom: theme.spacing(4)
  },
  faceScanProgressContainer: {
    position: 'relative',
    marginBottom: theme.spacing(2),
    justifyContent: 'center',
    alignItems: 'center'
  },
  video: {
    width: 100,
    height: 100,
    filter: 'sepia(1) hue-rotate(314deg) saturate(2) contrast(7)',
    borderRadius: 50,
    objectFit: 'cover'
  },
  countdown: {
    position: 'absolute',
    width: 100,
    height: 100,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    top: 0,
    left: 0,
    color: theme.palette.primary.main,
    textShadow: '-1px 0 white, 0 1px white, 1px 0 white, 0 -1px white'
  },
  progress: {
    position: 'absolute',
    top: -9,
    left: -9
  }
}));

const CreateUserPage = ({ users, progress, onSaveFace, onCancel, isSendingData }) => {
  const classes = useStyles();
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [saveFace, setSaveFace] = useState(true);
  const [showUserExists, setShowUserExists] = useState(false);
  const [cameraCountdown, setCameraCountdown] = useState(3);

  const handleNameChange = useCallback(event => {
    setName(event.target.value.trim());
  });
  const handleSaveFaceChange = useCallback(event => setSaveFace(!!event.target.checked));
  const handleUserExistsCancel = useCallback(() => setShowUserExists(false));

  const goToNextStep = useCallback(
    (newStep, overwriteUser) => {
      if (newStep === 1) {
        const userExists = users.find(user => user.name === name);
        if (userExists && !overwriteUser) {
          setShowUserExists(true);
          return;
        }
      }

      if (newStep === 2 && !saveFace) {
        onSaveFace(name, false);
        return;
      }

      setStep(newStep);
    },
    [name, saveFace, users]
  );

  const handleFormSubmit = useCallback(
    newStep => event => {
      event.preventDefault();
      goToNextStep(newStep);
    },
    [name, saveFace, users]
  );

  const handleUserExistsConfirm = useCallback(() => {
    setShowUserExists(false);
    goToNextStep(step + 1, true);
  }, [step]);

  useEffect(() => {
    const listener = event => {
      if (event.key === 'Enter') {
        goToNextStep(step + 1);
      }
    };
    document.addEventListener('keydown', listener);
    return () => {
      document.removeEventListener('keydown', listener);
    };
  }, [handleFormSubmit, step]);

  useEffect(() => {
    if (step === 3 && cameraCountdown > 0) {
      const timeout = setTimeout(() => {
        setCameraCountdown(cameraCountdown - 1);
      }, 1000);

      return () => {
        clearTimeout(timeout);
      };
    }

    if (step === 3 && cameraCountdown === 0) {
      onSaveFace(name, true);
    }

    return undefined;
  }, [step, cameraCountdown]);

  return (
    <form autoComplete="off" onSubmit={handleFormSubmit(step + 1)}>
      <Layout
        iconSrc="/assets/facial-recognition.svg"
        titleComponent={
          <Typography variant="h6" color="textPrimary" align="center">
            Create user
          </Typography>
        }
        actions={
          <>
            {(step === 1 || step === 2) && (
              <Button
                variant="contained"
                color="primary"
                type="button"
                className={classes.button}
                onClick={handleFormSubmit(step - 1)}
              >
                <NavigateBefore className={classes.leftIcon} />
                Back
              </Button>
            )}
            {step < 2 && (
              <Button variant="contained" color="primary" type="submit" className={classes.button}>
                Next
                <NavigateNextIcon className={classes.rightIcon} />
              </Button>
            )}
            {step === 2 && (
              <Button variant="contained" color="primary" type="submit" className={classes.button}>
                Ready
                <NavigateNextIcon className={classes.rightIcon} />
              </Button>
            )}
          </>
        }
      >
        <>
          <CloseButton onClick={onCancel} />
          <div className={classes.container}>
            <Stepper activeStep={step} className={classes.stepper}>
              <Step completed={step > 0}>
                <StepLabel />
              </Step>
              <Step completed={step > 1}>
                <StepLabel />
              </Step>
              <Step completed={step > 2}>
                <StepLabel />
              </Step>
              <Step completed={step > 3}>
                <StepLabel />
              </Step>
            </Stepper>
            {step === 0 && (
              <div className={classes.inputContainer}>
                <Typography color="textPrimary" gutterBottom>
                  Enter your name
                </Typography>
                <TextField
                  label="Name *"
                  value={name}
                  onChange={handleNameChange}
                  margin="normal"
                  variant="outlined"
                  inputProps={{
                    required: true,
                    pattern: '.{3,35}',
                    title: '3 to 35 characters'
                  }}
                />
                <Dialog open={showUserExists} onClose={handleUserExistsCancel}>
                  <DialogTitle>User exists</DialogTitle>
                  <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                      User with the same name already exists. Do you want to overwrite face data?
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleUserExistsCancel} color="primary">
                      Cancel
                    </Button>
                    <Button
                      onClick={handleUserExistsConfirm}
                      color="primary"
                      variant="contained"
                      autoFocus
                    >
                      Overwrite
                    </Button>
                  </DialogActions>
                </Dialog>
              </div>
            )}
            {step === 1 && (
              <div className={classes.inputContainer}>
                <Typography color="textPrimary" gutterBottom>
                  Uncheck the checkbox below if you don't want to save face data. Note that you
                  won't be able to use face detection.
                </Typography>
                <FormControlLabel
                  control={
                    <Checkbox
                      value="remember"
                      color="primary"
                      onChange={handleSaveFaceChange}
                      checked={saveFace}
                    />
                  }
                  label="Save with face"
                />
              </div>
            )}
            {step === 2 && (
              <div className={classes.inputContainer}>
                <Typography color="textPrimary" gutterBottom>
                  In the next step we will read your face data. You will need to look straight at
                  the camera. Press "Ready" when you are ready for the face scan.
                </Typography>
              </div>
            )}
            {step === 3 && (
              <div className={classes.inputContainer}>
                <div className={classes.faceScanProgressContainer}>
                  <Video autoPlay muted className={`mirror ${classes.video}`} />
                  {cameraCountdown ? (
                    <Zoom key={cameraCountdown} appear in>
                      <Typography variant="h2" gutterBottom className={classes.countdown}>
                        {cameraCountdown}
                      </Typography>
                    </Zoom>
                  ) : (
                    <CircularProgress
                      variant={isSendingData ? undefined : 'static'}
                      value={isSendingData ? undefined : progress}
                      className={classes.progress}
                      size={118}
                    />
                  )}
                </div>
                <Typography color="textPrimary" gutterBottom>
                  Face scan is in progress...
                </Typography>
              </div>
            )}
          </div>
        </>
      </Layout>
    </form>
  );
};

CreateUserPage.propTypes = {
  progress: PropTypes.number.isRequired,
  onSaveFace: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  isSendingData: PropTypes.bool.isRequired,
  users: PropTypes.array.isRequired
};

const mapStateToProps = state => ({
  progress: selectors.selectFaceDataCollectedPercentage(state),
  users: selectors.selectUsers(state),
  isSendingData: false // selectors.selectIsUpdatingUser(state)
});

const mapDispatchToProps = {
  onSaveFace: actions.saveFace,
  onCancel: actions.startScanningFaces
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateUserPage);
