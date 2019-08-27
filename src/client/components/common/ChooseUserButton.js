import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Button, MenuItem, Menu } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import * as actions from '../../store/actions';
import * as selectors from '../../store/selectors';

const ITEM_HEIGHT = 48;

const useStyles = makeStyles(theme => ({
  button: {
    margin: theme.spacing(1)
  },
  formControl: {
    minWidth: 220
  }
}));

const ChooseUserButton = ({ users, onUserPick }) => {
  const classes = useStyles();
  const [userAnchorEl, setUserAnchorEl] = useState(null);
  const handleUserMenuOpen = event => setUserAnchorEl(event.currentTarget);
  const getUserClickHandler = userId => () => {
    setUserAnchorEl(null);
    if (!userId) return;

    onUserPick(userId);
  };
  return (
    <>
      <Button
        variant="contained"
        color="primary"
        onClick={handleUserMenuOpen}
        className={classes.button}
      >
        Choose existing user
      </Button>
      <Menu
        id="existing-users"
        anchorEl={userAnchorEl}
        keepMounted
        open={Boolean(userAnchorEl)}
        onClose={getUserClickHandler()}
        PaperProps={{
          style: {
            maxHeight: ITEM_HEIGHT * 4.5,
            width: 200
          }
        }}
      >
        {users.map(user => (
          <MenuItem key={user.id} onClick={getUserClickHandler(user.id)}>
            {user.id}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

ChooseUserButton.propTypes = {
  users: PropTypes.array.isRequired,
  onUserPick: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  users: selectors.selectUsers(state)
});

const mapDispatchToProps = {
  onUserPick: actions.startSession
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChooseUserButton);
