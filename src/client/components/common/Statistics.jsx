import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import {
  CircularProgress,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  Paper,
  Toolbar
} from '@material-ui/core';

import {
  selectIsLoadStatisticsInProgress,
  selectMostPopularItems,
  selectMostActiveUsers,
  selectMostUnpopularItems
} from '../../store/selectors';
import * as actions from '../../store/actions';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    padding: theme.spacing(2)
  },
  icon: {
    marginRight: theme.spacing(2)
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(2, 2, 0, 2),
    justifyContent: 'flex-end'
  },
  content: {
    width: '100vw',
    flex: 1
  },
  section: {
    marginBottom: theme.spacing(4)
  }
}));

const Statistics = ({
  visible,
  isLoading,
  mostPopularItems,
  mostUnpopularItems,
  mostActiveUsers,
  loadStatistics
}) => {
  const classes = useStyles();
  useEffect(() => {
    if (visible) {
      loadStatistics();
    }
  }, [visible]);

  const mostUnpopularTop =
    mostUnpopularItems.length >= 3 ? mostUnpopularItems.slice(0, 3) : mostUnpopularItems;
  const unpopularNotDisplayedCount = mostUnpopularItems.length - mostUnpopularTop.length;
  return (
    <div className={classes.container}>
      {isLoading || !visible ? (
        <CircularProgress variant="static" className={classes.progress} />
      ) : (
        <>
          <Paper className={classes.section}>
            <Toolbar>
              <Typography variant="h6" id="tableTitle">
                Most popular items
              </Typography>
            </Toolbar>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell align="right">Times taken</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {mostPopularItems.map(item => (
                  <TableRow key={`most-popular-${item.id}`}>
                    <TableCell component="th" scope="row">
                      {`${item.primaryTitle} (${item.secondaryTitle})`}
                    </TableCell>
                    <TableCell align="right">{item.timesTaken}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
          <Paper className={classes.section}>
            <Toolbar>
              <Typography variant="h6" id="tableTitle">
                Most unpopular items
              </Typography>
            </Toolbar>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell align="right">Times taken</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {mostUnpopularTop.map(item => (
                  <TableRow key={`most-popular-${item.id}`}>
                    <TableCell component="th" scope="row">
                      {`${item.primaryTitle} (${item.secondaryTitle})`}
                    </TableCell>
                    <TableCell align="right">{item.timesTaken}</TableCell>
                  </TableRow>
                ))}
                {unpopularNotDisplayedCount > 0 ? (
                  <TableRow>
                    <TableCell colSpan={2} align="right">
                      {`And ${unpopularNotDisplayedCount} more with the same count...`}
                    </TableCell>
                  </TableRow>
                ) : null}
              </TableBody>
            </Table>
          </Paper>
          <Paper className={classes.section}>
            <Toolbar>
              <Typography variant="h6" id="tableTitle">
                Most active users
              </Typography>
            </Toolbar>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell align="right">Items used</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {mostActiveUsers.map(user => (
                  <TableRow key={`most-popular-users-${user.id}`}>
                    <TableCell component="th" scope="row">
                      {user.name}
                    </TableCell>
                    <TableCell align="right">{user.timesTaken}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </>
      )}
    </div>
  );
};

Statistics.propTypes = {
  loadStatistics: PropTypes.func.isRequired,
  mostPopularItems: PropTypes.array.isRequired,
  mostUnpopularItems: PropTypes.array.isRequired,
  mostActiveUsers: PropTypes.array.isRequired,
  visible: PropTypes.bool
};

const mapStateToProps = state => ({
  isLoading: selectIsLoadStatisticsInProgress(state),
  mostPopularItems: selectMostPopularItems(state),
  mostUnpopularItems: selectMostUnpopularItems(state),
  mostActiveUsers: selectMostActiveUsers(state)
});

const mapDispatchToProps = {
  loadStatistics: actions.loadStatistics
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Statistics);
