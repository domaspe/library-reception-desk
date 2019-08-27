import React, { useCallback } from 'react';
import { Typography, Button } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Layout from '../common/Layout';
import ItemList from '../common/ItemList';
import history from '../../utils/history';
import { selectItems } from '../../store/selectors';
import * as actions from '../../store/actions';

const ItemLog = ({ items, assignItem }) => {
  const handlRemoveItemClick = useCallback(itemId => assignItem(itemId, null));
  return (
    <Layout
      iconSrc="/assets/cart.svg"
      actions={
        <Button color="primary" onClick={useCallback(() => history.goBack())}>
          Close
        </Button>
      }
      titleComponent={
        <Typography variant="h6" color="textPrimary" align="center">
          All items
        </Typography>
      }
    >
      <Typography color="textPrimary" align="center" gutterBottom>
        Here you can see the status of all the items in store. Click on&nbsp;
        <CloseIcon />
        &nbsp;to cancel the reservation.
      </Typography>

      <ItemList items={items} onItemClick={handlRemoveItemClick} />
    </Layout>
  );
};

ItemLog.propTypes = {
  assignItem: PropTypes.func.isRequired,
  items: PropTypes.array.isRequired
};

const mapStateToProps = state => ({
  items: selectItems(state, 'title')
});

const mapDispatchToProps = {
  assignItem: actions.tryAssignItem
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ItemLog);
