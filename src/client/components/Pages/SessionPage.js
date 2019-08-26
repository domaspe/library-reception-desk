import React from 'react';
import PropTypes from 'prop-types';
import { Button, Typography, Tabs, Tab, Box, AppBar } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import SwipeableViews from 'react-swipeable-views';
// eslint-disable-next-line import/no-extraneous-dependencies
import PlaylistAddCheckIcon from '@material-ui/icons/PlaylistAddCheck';
import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd';
import AddIcon from '@material-ui/icons/Add';
import {
  selectActiveUserId,
  selectNotifyAssignItemAuccess
} from '../../store/selectors';
import * as actions from '../../store/actions';
import Layout from '../common/Layout';
import { useIconAnimation } from '../../utils/hooks';
import ItemList from '../common/ItemList';
import LogButton from '../common/LogButton';

const useStyles = makeStyles(theme => ({
  name: {
    fontWeight: 'bold'
  },
  tabs: {
    width: '100%'
  },
  swipeable: {
    backgroundColor: theme.palette.background.paper,
    width: '100%'
  },
  tabText: {
    padding: theme.spacing(2, 2, 0, 2)
  },
  tabContent: {
    paddingBottom: theme.spacing(2)
  }
}));

const SessionPage = ({ userId, onLogout, assignItemSuccess }) => {
  const classes = useStyles();
  const [animateIcon, onIconAnimationEnd] = useIconAnimation(assignItemSuccess);
  const [tab, setTab] = React.useState(0);
  const handleTabChange = (event, newValue) => setTab(newValue);
  const handleSwipeChange = index => setTab(index);

  return (
    <Layout
      iconSrc="/assets/qr.svg"
      animateIcon={animateIcon}
      onIconAnimationEnd={onIconAnimationEnd}
      titleComponent={
        <>
          <Typography
            variant="h6"
            color="textPrimary"
            align="center"
            className={classes.greeting}
          >
            Hey there,&nbsp;
          </Typography>
          <Typography
            variant="h6"
            color="textPrimary"
            align="center"
            className={classes.name}
          >
            {userId}
          </Typography>
        </>
      }
      actions={
        <>
          <Button variant="contained" color="primary" onClick={onLogout}>
            End session
          </Button>
        </>
      }
    >
      <AppBar position="relative" color="default">
        <Tabs
          value={tab}
          onChange={handleTabChange}
          variant="fullWidth"
          indicatorColor="primary"
          textColor="primary"
          className={classes.tabs}
        >
          <Tab label="Taken items" />
          <Tab label="Free items" />
        </Tabs>
      </AppBar>
      <SwipeableViews
        index={tab}
        onChangeIndex={handleSwipeChange}
        className={classes.swipeable}
      >
        <>
          <div className={classes.tabText}>
            <Typography color="textPrimary" gutterBottom>
              Below are the devices that you’ve taken out. If you want to
              take/return a device, face the QR code on the back of the device
              towards the camera.
            </Typography>
          </div>
          <div className={classes.tabContent}>
            <ItemList show="taken" />
          </div>
        </>
        <Box>
          <div className={classes.tabText}>
            <Typography color="textPrimary" align="center" gutterBottom>
              Here you can see all items still available. Click on&nbsp;
              <AddIcon />
              &nbsp; to reserve the item.
            </Typography>
          </div>
          <div className={classes.tabContent}>
            <ItemList show="free" />
          </div>
        </Box>
      </SwipeableViews>
    </Layout>
  );
};

SessionPage.propTypes = {
  onLogout: PropTypes.func.isRequired,
  userId: PropTypes.string.isRequired
};

const mapStateToProps = state => {
  const userId = selectActiveUserId(state);
  return {
    userId,
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
