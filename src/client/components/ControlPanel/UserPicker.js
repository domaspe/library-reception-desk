import React from 'react';
import { connect } from 'react-redux';
import {
  Select,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  FormControl,
  InputLabel,
  Input,
  DialogActions
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { selectUsers, selectIsUserPickerOpen, selectUserPickerTitle } from '../../store/selectors';
import * as actions from '../../store/actions';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120
  }
}));

const UserPicker = ({ users, open, title, pickUser, close }) => {
  const classes = useStyles();
  const [userValue, setUserValue] = React.useState('');

  React.useEffect(() => {
    if (!open) {
      setUserValue('');
    }
  }, [open]);

  const handleClose = () => {
    close();
  };

  const handleChange = event => {
    setUserValue(event.target.value);
  };

  const handleSubmit = event => {
    event.preventDefault();
    pickUser(userValue);
  };

  return (
    <div>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
        {title && <DialogTitle>{title}</DialogTitle>}
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <div className={classes.container}>
              <FormControl className={classes.formControl} style={{ width: '100%' }}>
                <InputLabel htmlFor="user">User</InputLabel>
                <Select
                  autoWidth
                  native
                  value={userValue}
                  onChange={handleChange}
                  input={<Input id="user" />}
                >
                  <option value="" />
                  {users.map(user => (
                    <option key={`user-picker-option-${user.id}`} value={user.id}>
                      {user.id}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button color="primary" type="submit">
              Ok
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
};

const mapStateToProps = state => ({
  users: selectUsers(state),
  open: selectIsUserPickerOpen(state),
  title: selectUserPickerTitle(state)
});

const mapDispatchToProps = {
  pickUser: actions.pickUser,
  close: actions.closeUserPicker
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserPicker);
