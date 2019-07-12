import React from 'react';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import {
  TextField,
  Button,
  FormControlLabel,
  Switch,
  Grid,
  Typography,
  LinearProgress
} from '@material-ui/core';
import {
  selectIsSavingFace,
  selectFaceDataCollectedPercentage,
  selectIsUpdatingClass
} from '../../store/selectors';
import * as actions from '../../store/actions';
import { MAIN_VIEW } from '../../constants';

const useStyles = makeStyles(theme => ({
  container: {
    flex: 1,
    flexDirection: 'row',
    width: '100%'
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1)
  },
  buttons: {
    flex: 1
  },
  button: {
    marginBottom: theme.spacing(1)
  }
}));

const CreateUser = ({ isSavingFace, faceSaveProgress, saveFace, saveFaceless, setView }) => {
  const classes = useStyles();
  const [nameError, setNameError] = React.useState(false);
  const [name, setName] = React.useState('');
  const [withFace, setWithFace] = React.useState(true);

  const handleNameChange = React.useCallback(event => setName(event.target.value));
  const handleFaceChange = React.useCallback(event => setWithFace(event.target.checked));

  const handleSubmit = React.useCallback(
    event => {
      event.preventDefault();

      if (name.length < 3) {
        setNameError(true);
        return;
      }

      if (withFace) {
        saveFace(name);
      } else {
        saveFaceless(name);
      }
    },
    [withFace, saveFace, name]
  );

  const handleCancel = React.useCallback(() => {
    setView(MAIN_VIEW);
  }, [setView]);

  if (isSavingFace) {
    return (
      <div className={classes.container}>
        <Typography variant="h5" color="textSecondary" paragraph>
          {`Saving "${name}"`}
        </Typography>
        <LinearProgress variant="determinate" value={faceSaveProgress} />
      </div>
    );
  }

  return (
    <form className={classes.container} noValidate autoComplete="off" onSubmit={handleSubmit}>
      <Typography variant="h5" color="textSecondary">
        Create New User
      </Typography>
      <Grid container spacing={2} justify="center" alignContent="center" alignItems="center">
        <Grid item xs={6}>
          <TextField
            label="Name"
            className={classes.textField}
            value={name}
            onChange={handleNameChange}
            margin="normal"
            variant="outlined"
            error={nameError}
          />
        </Grid>
        <Grid item xs={6}>
          <FormControlLabel
            control={
              <Switch
                checked={withFace}
                onChange={handleFaceChange}
                value="saveFace"
                color="primary"
              />
            }
            label="Save face"
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            className={classes.button}
            type="submit"
          >
            Save
          </Button>
          <Button
            fullWidth
            variant="contained"
            color="secondary"
            type="submit"
            onClick={handleCancel}
          >
            Cancel
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

const mapStateToProps = state => ({
  isSavingFace: selectIsSavingFace(state) || selectIsUpdatingClass(state),
  faceSaveProgress: selectFaceDataCollectedPercentage(state)
});

const mapDispatchToProps = {
  saveFace: actions.saveFace,
  saveFaceless: actions.saveFaceless,
  setView: actions.setView
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateUser);
