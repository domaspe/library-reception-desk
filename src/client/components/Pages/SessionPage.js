import React, { useCallback, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  IconButton,
  Grid,
  Button,
  Typography,
  Paper,
  Box
} from '@material-ui/core';
import { Clear as ClearIcon } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import moment from 'moment';
// eslint-disable-next-line import/no-extraneous-dependencies
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import {
  selectUserItems,
  selectActiveUserId,
  selectNotifyAssignItemAuccess
} from '../../store/selectors';
import * as actions from '../../store/actions';
import Layout from '../common/Layout';
import { useIconAnimation } from '../../utils/hooks';

const useStyles = makeStyles(theme => ({
  name: {
    fontWeight: 'bold'
  },
  caption1: {
    fontWeight: 'bold'
  },
  caption2: {},
  gridListContainer: {
    height: '50vh',
    width: '100%'
  },
  list: {
    maxHeight: '50vh',
    width: '100%',
    overflow: 'scroll'
  },
  item: {
    padding: theme.spacing(2),
    margin: theme.spacing(2),
    paddingRight: theme.spacing(6),
    display: 'flex',
    position: 'relative'
  },
  close: {
    position: 'absolute',
    top: 0,
    right: 0
    // margin: theme.spacing(2)
  },
  description: {},
  thumbnail: {
    height: '100%',
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
    backgroundOrigin: 'content-box',
    backgroundPosition: 'center',
    paddingRight: theme.spacing(2)
  }
}));

const SessionPage = ({
  userId,
  items,
  tryAssignItem,
  onLogout,
  assignItemSuccess
}) => {
  const classes = useStyles();
  const [animateIcon, onIconAnimationEnd] = useIconAnimation(assignItemSuccess);

  return (
    <Layout
      iconSrc="/assets/qr.svg"
      animateIcon={animateIcon}
      onIconAnimationEnd={onIconAnimationEnd}
      titleComponent={
        <>
          <Typography
            variant="h4"
            color="textPrimary"
            align="center"
            className={classes.greeting}
          >
            Hey there,&nbsp;
          </Typography>
          <Typography
            variant="h4"
            color="textPrimary"
            align="center"
            className={classes.name}
          >
            {userId}
          </Typography>
        </>
      }
      actions={
        <Button variant="contained" color="primary" onClick={onLogout}>
          End session
        </Button>
      }
    >
      <Typography color="textPrimary" gutterBottom>
        Below are the devices that you’ve taken out. If you want to take/return
        a device, face the QR code on the back of the device towards the camera.
      </Typography>
      <Box className={classes.gridListContainer}>
        <Box className={classes.list}>
          <TransitionGroup>
            {items.map(item => (
              <CSSTransition key={item.id} timeout={100} classNames="item">
                <Box>
                  <Paper className={classes.item}>
                    <Grid container>
                      <Grid item xs={2}>
                        <Box
                          className={classes.thumbnail}
                          style={{
                            backgroundImage: `url("/data/thumbnails/${item.thumbnail}")`
                          }}
                        />
                      </Grid>
                      <Grid item xs={10}>
                        <Box className={classes.description}>
                          <Typography className={classes.caption1} noWrap>
                            {item.caption1}
                          </Typography>
                          <Typography className={classes.caption2} noWrap>
                            {item.caption2}
                          </Typography>
                          <Typography variant="caption">
                            Taken&nbsp;
                            {moment(item.dateTaken).format(
                              'MMM Do YYYY, hh:mm'
                            )}
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                    <IconButton
                      color="primary"
                      onClick={() => tryAssignItem(item.id)}
                      className={classes.close}
                    >
                      <ClearIcon />
                    </IconButton>
                  </Paper>
                </Box>
              </CSSTransition>
            ))}
          </TransitionGroup>
        </Box>
      </Box>
    </Layout>
  );
};

SessionPage.propTypes = {
  onLogout: PropTypes.func.isRequired,
  userId: PropTypes.string.isRequired,
  items: PropTypes.array.isRequired,
  tryAssignItem: PropTypes.func.isRequired
};

const mapStateToProps = state => {
  const userId = selectActiveUserId(state);
  return {
    userId,
    items: selectUserItems(state, userId),
    assignItemSuccess: selectNotifyAssignItemAuccess(state)
  };
};

const mapDispatchToProps = {
  tryAssignItem: actions.tryAssignItem,
  onLogout: actions.endSession
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SessionPage);