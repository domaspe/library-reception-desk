import React, { useCallback } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

import ItemList from './ItemList';
import { createTakenItemsFilterSelector } from '../../store/selectors';
import * as actions from '../../store/actions';
import SearchField from './SearchField';
import { useSearchFilter } from '../../utils/hooks';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%'
  },
  icon: {
    marginRight: theme.spacing(2)
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(2),
    justifyContent: 'flex-end'
  },
  content: {
    width: '100vw',
    flex: 1
  }
}));

const DrawerItems = ({ visible, selectFilteredItems, assignItem }) => {
  const classes = useStyles();
  const handlRemoveItemClick = useCallback(itemId => assignItem(itemId, null));

  const [items, handleFilterChange] = useSearchFilter(selectFilteredItems);

  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <SearchField onChange={handleFilterChange} visible={visible} />
      </div>
      <div className={classes.content}>
        <ItemList items={items} onItemClick={handlRemoveItemClick} height="100%" animate={false} />
      </div>
    </div>
  );
};

DrawerItems.propTypes = {
  assignItem: PropTypes.func.isRequired,
  selectFilteredItems: PropTypes.func.isRequired,
  visible: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
  selectFilteredItems: createTakenItemsFilterSelector(state)
});

const mapDispatchToProps = {
  assignItem: actions.tryAssignItem
};

export default connect(mapStateToProps, mapDispatchToProps)(DrawerItems);
