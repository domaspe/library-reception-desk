import { Button, Menu, MenuItem } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as actions from '../../store/actions';
import * as selectors from '../../store/selectors';
import history from '../../utils/history';
import { usePrevious } from '../../utils/hooks';

const ITEM_HEIGHT = 48;

const useStyles = makeStyles(theme => ({
  button: {
    margin: theme.spacing(1)
  },
  formControl: {
    minWidth: 220
  }
}));

const ChooseUserButton = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [userAnchorEl, setUserAnchorEl] = useState(null);

  const handleUserMenuOpen = event => {
    setUserAnchorEl(event.currentTarget);
    history.replace('?pause');
  };
  const handleUserMenuClose = () => {
    setUserAnchorEl(null);
    history.replace('?');
  };
  const getUserClickHandler = userId => () => {
    setUserAnchorEl(null);
    if (!userId) return;

    dispatch(actions.startSession(userId));
  };
  const users = useSelector(selectors.selectUsers);

  const search = useSelector(selectors.selectSearch);
  const prevSearch = usePrevious(search);
  useEffect(() => {
    // Close if menu is open when redirected to not paused
    if (prevSearch !== search && prevSearch === '?pause' && userAnchorEl) {
      handleUserMenuClose(null);
    }
  }, [prevSearch, search, userAnchorEl]);

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        onClick={handleUserMenuOpen}
        className={classes.button}
        disabled={!users.length}
      >
        Choose existing user
      </Button>
      <Menu
        id="existing-users"
        anchorEl={userAnchorEl}
        keepMounted
        open={Boolean(userAnchorEl)}
        onClose={handleUserMenuClose}
        PaperProps={{
          style: {
            maxHeight: ITEM_HEIGHT * 4.5,
            width: 200
          }
        }}
      >
        {users.map(user => (
          <MenuItem key={user.id} onClick={getUserClickHandler(user.id)}>
            {user.name}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default ChooseUserButton;
