import React, { useState, useCallback } from 'react';
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
  StepLabel
} from '@material-ui/core';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import NavigateBefore from '@material-ui/icons/NavigateBefore';
import * as selectors from '../../store/selectors';
import * as actions from '../../store/actions';
import Layout from '../common/Layout';

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
    width: '100%',
    marginBottom: theme.spacing(4)
  },
  progress: {
    marginTop: theme.spacing(2)
  }
}));

const CreateUserPage = ({ progress, onSaveFace, onCancel, isSendingData }) => {
  const classes = useStyles();
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [saveFace, setSaveFace] = useState(true);

  const handleNameChange = useCallback(event => {
    setName(event.target.value);
  });
  const handleSaveFaceChange = useCallback(event =>
    setSaveFace(!!event.target.checked)
  );

  const goToStep = useCallback(
    newStep => event => {
      event.preventDefault();
      setStep(newStep);

      if (newStep === 2) {
        onSaveFace(name, saveFace);
      }
    },
    [name, saveFace]
  );

  return (
    <form autoComplete="off" onSubmit={goToStep(step + 1)}>
      <Layout
        iconSrc="/assets/facial-recognition.svg"
        titleComponent={
          <Typography variant="h6" color="textPrimary" align="center">
            Create user
          </Typography>
        }
        actions={
          <>
            {step === 0 && (
              <Button
                color="primary"
                onClick={onCancel}
                className={classes.button}
              >
                Close
              </Button>
            )}
            {step > 0 && (
              <Button
                variant="contained"
                color="primary"
                type="button"
                className={classes.button}
                onClick={goToStep(step - 1)}
              >
                <NavigateBefore className={classes.leftIcon} />
                Back
              </Button>
            )}
            <Button
              variant="contained"
              color="primary"
              type="submit"
              className={classes.button}
            >
              Next
              <NavigateNextIcon className={classes.rightIcon} />
            </Button>
          </>
        }
      >
        <>
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
              </div>
            )}
            {step === 1 && (
              <div className={classes.inputContainer}>
                <Typography color="textPrimary" gutterBottom>
                  Uncheck the checkbox below if you don't want to save face
                  data. Note that you won't be able to use face detection.
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
            {step === 2 && !isSendingData && (
              <div className={classes.inputContainer}>
                <Typography color="textPrimary" gutterBottom>
                  Look at the camera. Face scan is in progress...
                </Typography>
                <CircularProgress
                  variant="static"
                  value={progress}
                  className={classes.progress}
                />
              </div>
            )}
            {step === 2 && isSendingData && (
              <div className={classes.inputContainer}>
                <CircularProgress className={classes.progress} />
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
  isSendingData: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
  progress: selectors.selectFaceDataCollectedPercentage(state) * 0.8,
  isSendingData:
    selectors.selectIsUpdatingClass(state) ||
    selectors.selectIsLoadingUsers(state)
});

const mapDispatchToProps = {
  onSaveFace: actions.saveFace,
  onCancel: actions.startScanningFaces
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateUserPage);
