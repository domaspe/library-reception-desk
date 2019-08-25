import React, { useCallback } from 'react';
import { Typography, Button } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import AddIcon from '@material-ui/icons/Add';

import Layout from '../common/Layout';
import ItemList from '../common/ItemList';
import history from '../../utils/history';

const ItemLog = ({ showAll }) => {
  return (
    <Layout
      iconSrc="/assets/cart.svg"
      actions={
        <Button color="primary" onClick={useCallback(() => history.goBack())}>
          Close
        </Button>
      }
      titleComponent={
        <>
          {showAll && (
            <Typography variant="h6" color="textPrimary" align="center">
              All items
            </Typography>
          )}
          {!showAll && (
            <Typography variant="h6" color="textPrimary" align="center">
              Add items manually
            </Typography>
          )}
        </>
      }
    >
      {showAll && (
        <Typography color="textPrimary" align="center" gutterBottom>
          Here you can see the status of all the items in store. Click on&nbsp;
          <CloseIcon />
          &nbsp;to cancel the reservation.
        </Typography>
      )}
      {!showAll && (
        <Typography color="textPrimary" align="center" gutterBottom>
          Here you can see all items still available. Click on&nbsp;
          <AddIcon />
          &nbsp; to reserve the item.
        </Typography>
      )}
      <ItemList show={showAll ? 'all' : 'free'} />
    </Layout>
  );
};

export default ItemLog;
