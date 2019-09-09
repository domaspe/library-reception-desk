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
import {
  selectIsItemsDrawerOpen,
  createAllItemsFilterSelector
} from '../../store/selectors';
import * as actions from '../../store/actions';
import Icon from './Icon';
import SearchField from './SearchField';
import { useSearchFilter } from '../../utils/hooks';

const useStyles = makeStyles(theme => ({
  icon: {
    marginRight: theme.spacing(2)
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    height: 64,
    justifyContent: 'space-between'
  },
  drawerName: {
    display: 'flex',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  content: {
    width: '70vw',
    maxWidth: 850,
    minWidth: 400,
    height: 'calc(100% - 64px)'
  }
}));

const ItemsDrawer = ({
  open,
  selectFilteredItems,
  setDrawerOpen,
  assignItem
}) => {
  const classes = useStyles();
  const handlRemoveItemClick = useCallback(itemId => assignItem(itemId, null));
  const handleClose = useCallback(() => setDrawerOpen(false));

  const [items, handleFilterChange] = useSearchFilter(selectFilteredItems);

  return (
    <Drawer open={open} onClose={handleClose}>
      <div className={classes.drawerHeader}>
        <div className={classes.drawerName}>
          <Icon src="/assets/cart.svg" size={24} className={classes.icon} />
          <Typography variant="h6" color="textPrimary" align="center">
            All items
          </Typography>
        </div>
        <div>
          <SearchField onChange={handleFilterChange} open={open} />
        </div>
        <IconButton onClick={handleClose}>
          <ChevronLeftIcon />
        </IconButton>
      </div>
      <Divider />

      <Box className={classes.content}>
        <ItemList
          items={items}
          onItemClick={handlRemoveItemClick}
          height="100%"
          animate={false}
        />
      </Box>
    </Drawer>
  );
};

ItemsDrawer.propTypes = {
  assignItem: PropTypes.func.isRequired,
  selectFilteredItems: PropTypes.func.isRequired,
  setDrawerOpen: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
  selectFilteredItems: createAllItemsFilterSelector(state),
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
