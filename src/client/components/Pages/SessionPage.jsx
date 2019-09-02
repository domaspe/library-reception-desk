import React, { useCallback, memo } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Typography,
  Tabs,
  Tab,
  AppBar,
  Badge
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import SwipeableViews from 'react-swipeable-views';
import AddIcon from '@material-ui/icons/Add';
import shallowequal from 'shallowequal';
import {
  selectNotifyAssignItemSuccess,
  selectFreeItems,
  selectUserItems,
  selectActiveUser
} from '../../store/selectors';
import * as actions from '../../store/actions';
import Layout from '../common/Layout';
import { useIconAnimation } from '../../utils/hooks';
import ItemList from '../common/ItemList';

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
    margin: theme.spacing(2, 2, 0, 2),
    minHeight: 50
  },
  tabContent: {},
  badge: {
    padding: theme.spacing(0, 2)
  },
  swipeableSlide: {
    overflow: 'hidden !important' // Override swipeable style prop
  }
}));

function areEqual(prevProps, nextProps) {
  return (
    shallowequal(prevProps, nextProps) ||
    (prevProps.userId && !nextProps.userId) // do not render on logout while route transition is in progress
  );
}

const SessionPage = memo(
  ({
    userId,
    userName,
    onLogout,
    freeItems,
    userItems,
    assignItemSuccess,
    assignItem
  }) => {
    const classes = useStyles();
    const [animateIcon, onIconAnimationEnd] = useIconAnimation(
      assignItemSuccess
    );
    const [tab, setTab] = React.useState(0);
    const handleTabChange = (event, newValue) => setTab(newValue);
    const handleSwipeChange = index => setTab(index);

    const handleAddItemClick = useCallback(itemId =>
      assignItem(itemId, userId)
    );
    const handlRemoveItemClick = useCallback(itemId =>
      assignItem(itemId, null)
    );

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
              {userName}
            </Typography>
          </>
        }
        actions={
          <>
            <Button color="primary" onClick={onLogout}>
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
            <Tab
              label={
                userItems.length > 0 ? (
                  <Badge
                    className={classes.badge}
                    color="primary"
                    badgeContent={userItems.length}
                  >
                    Your items
                  </Badge>
                ) : (
                  'Your items'
                )
              }
            />
            <Tab label="Add items manually" />
          </Tabs>
        </AppBar>
        <SwipeableViews
          index={tab}
          onChangeIndex={handleSwipeChange}
          className={classes.swipeable}
          slideClassName={classes.swipeableSlide}
        >
          <>
            <div className={classes.tabText}>
              <Typography color="textPrimary" align="center" gutterBottom>
                Below are the devices that you’ve taken out. If you want to
                take/return a device, face the QR code on the back of the device
                towards the camera.
              </Typography>
            </div>
            <div className={classes.tabContent}>
              <ItemList items={userItems} onItemClick={handlRemoveItemClick} />
            </div>
          </>
          <>
            <div className={classes.tabText}>
              <Typography color="textPrimary" align="center" gutterBottom>
                Here you can see all items still available. Click on&nbsp;
                <AddIcon />
                &nbsp; to reserve the item.
              </Typography>
            </div>
            <div className={classes.tabContent}>
              <ItemList
                items={freeItems}
                onItemClick={handleAddItemClick}
                showAdd
              />
            </div>
          </>
        </SwipeableViews>
      </Layout>
    );
  },
  areEqual
);

SessionPage.propTypes = {
  onLogout: PropTypes.func.isRequired,
  assignItem: PropTypes.func.isRequired,
  userId: PropTypes.number,
  userName: PropTypes.string,
  freeItems: PropTypes.array.isRequired,
  userItems: PropTypes.array.isRequired
};

const mapStateToProps = state => {
  const user = selectActiveUser(state) || {};
  return {
    userId: user.id,
    userName: user.name,
    assignItemSuccess: selectNotifyAssignItemSuccess(state),
    freeItems: selectFreeItems(state, 'title'),
    userItems: selectUserItems(state, user.id, 'timeTaken')
  };
};

const mapDispatchToProps = {
  assignItem: actions.tryAssignItem,
  onLogout: actions.endSession
};

SessionPage.displayName = 'SessionPage';

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SessionPage);
