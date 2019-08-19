import React, { useState, useCallback } from 'react';
import { connect } from 'react-redux';
import {
  Button,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import * as actions from '../../store/actions';
import * as selectors from '../../store/selectors';

const useStyles = makeStyles(theme => ({
  button: {
    margin: theme.spacing(1)
  },
  formControl: {
    minWidth: 220
  }
}));

const HelpOptions = ({ users, onClose, onCreate, onUserPick }) => {
  const [open, setOpen] = useState(false);
  const handleDialogOpen = () => setOpen(true);
  const handleDialogClose = () => setOpen(false);
  const handleChange = useCallback(event => {
    const { value } = event.target;
    if (!value) return;
    onUserPick(value);
  });

  const classes = useStyles();
  return (
    <>
      <Button
        variant="contained"
        color="primary"
        onClick={handleDialogOpen}
        className={classes.button}
      >
        Choose existing user
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={onCreate}
        className={classes.button}
      >
        Create new user
      </Button>
      <Button color="primary" onClick={onClose} className={classes.button}>
        Try again
      </Button>

      <Dialog
        disableBackdropClick
        disableEscapeKeyDown
        open={open}
        onClose={handleDialogClose}
      >
        <DialogTitle>Pick existing user</DialogTitle>
        <DialogContent>
          <Grid spacing={2} container justify="center" alignItems="center">
            <Grid item xs={12} justify="center" alignItems="center" container>
              <FormControl className={classes.formControl}>
                <InputLabel htmlFor="pick-existing-user">User</InputLabel>
                <Select value="" onChange={handleChange}>
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {users.map(user => (
                    <MenuItem key={user.id} value={user.id}>
                      {user.id}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

HelpOptions.propTypes = {
  onClose: PropTypes.func.isRequired,
  onCreate: PropTypes.func.isRequired,
  onUserPick: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  users: selectors.selectUsers(state)
});

const mapDispatchToProps = {
  onClose: actions.startScanningFaces,
  onCreate: actions.createUser,
  onUserPick: actions.startSession
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HelpOptions);
