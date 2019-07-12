import React from 'react';
import { connect } from 'react-redux';
import { Table, TableHead, TableRow, TableCell, TableBody } from '@material-ui/core';
import { selectItems } from '../store/selectors';
import { itemToString } from '../utils/item';

const Items = ({ items }) => {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Device</TableCell>
          <TableCell>User</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {items.map(item => (
          <TableRow key={`${item.id}_${item.name}`}>
            <TableCell component="th" scope="row">
              {itemToString(item)}
            </TableCell>
            <TableCell>{item.user}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

const mapStateToProps = state => ({
  items: selectItems(state)
});

export default connect(mapStateToProps)(Items);
