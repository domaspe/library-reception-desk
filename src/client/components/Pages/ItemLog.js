import React, { useCallback } from 'react';
import { Typography, Button } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

import Layout from '../common/Layout';
import ItemList from '../common/ItemList';
import history from '../../utils/history';

const ItemLog = () => {
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

      <ItemList show="all" />
    </Layout>
  );
};

export default ItemLog;
