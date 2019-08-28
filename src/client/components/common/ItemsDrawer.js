import React, { useCallback } from 'react';
import {
  Drawer,
  Typography,
  Box,
  IconButton,
  Divider
} from '@material-ui/core';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import { makeStyles } from '@material-ui/core/styles';

import ItemList from './ItemList';
import { selectItems, selectIsItemsDrawerOpen } from '../../store/selectors';
import * as actions from '../../store/actions';

const useStyles = makeStyles(theme => ({
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: 'space-between'
  }
}));

const ItemsDrawer = ({ open, items, setDrawerOpen, assignItem }) => {
  const classes = useStyles();
  const handlRemoveItemClick = useCallback(itemId => assignItem(itemId, null));
  const handleClose = useCallback(() => setDrawerOpen(false));
  return (
    <Drawer open={open} onClose={handleClose}>
      <div className={classes.drawerHeader}>
        <Box>
          <Typography variant="h6" color="textPrimary" align="center">
            All items
          </Typography>
        </Box>
        <IconButton onClick={handleClose}>
          <ChevronLeftIcon />
        </IconButton>
      </div>
      <Divider />

      <Box style={{ width: '70vw' }}>
        <ItemList
          items={items}
          onItemClick={handlRemoveItemClick}
          height="100%"
        />
      </Box>
    </Drawer>
  );
};

ItemsDrawer.propTypes = {
  assignItem: PropTypes.func.isRequired,
  items: PropTypes.array.isRequired,
  setDrawerOpen: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
  items: selectItems(state, 'title'),
  open: selectIsItemsDrawerOpen(state)
});

const mapDispatchToProps = {
  assignItem: actions.tryAssignItem,
  setDrawerOpen: actions.setItemsDrawerOpen
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ItemsDrawer);
