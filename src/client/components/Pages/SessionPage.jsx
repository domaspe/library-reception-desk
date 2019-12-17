import React, { useCallback, memo, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Typography, Tabs, Tab, AppBar } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import SwipeableViews from 'react-swipeable-views';
import shallowequal from 'shallowequal';
import classNames from 'classnames';
import {
  selectNotifyAssignItemSuccess,
  selectUserItems,
  selectActiveUser,
  createFreeItemsFilterSelector
} from '../../store/selectors';
import * as actions from '../../store/actions';
import Layout from '../common/Layout';
import { useIconAnimation, useSearchFilter } from '../../utils/hooks';
import ItemList from '../common/ItemList';
import SearchField from '../common/SearchField';
import CloseButton from '../common/CloseButton';

const useStyles = makeStyles(theme => ({
  username: {
    display: 'flex'
  },
  name: {
    fontWeight: 'bold'
  },
  tabs: {
    width: '100%'
  },
  swipeable: {
    backgroundColor: theme.palette.background.paper,
    width: '100%',
    flex: 1
  },
  tabTop: {
    margin: theme.spacing(2),
    minHeight: 50,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  searchContainer: {
    marginLeft: theme.spacing(2)
  },
  tabContent: {
    flex: 1
  },
  badge: {
    padding: theme.spacing(0, 2)
  },
  swipeableSlide: {
    overflow: 'hidden !important', // Override swipeable style prop
    display: 'flex',
    flexDirection: 'column'
  }
}));

function areEqual(prevProps, nextProps) {
  return (
    shallowequal(prevProps, nextProps) || (prevProps.userId && !nextProps.userId) // do not render on logout while route transition is in progress
  );
}

const SessionPage = memo(
  ({
    userId,
    userName,
    onLogout,
    selectFilteredFreeItems,
    userItems,
    assignItemSuccess,
    assignItem
  }) => {
    const classes = useStyles();
    const [animateIcon, onIconAnimationEnd] = useIconAnimation(assignItemSuccess);
    const [tab, setTab] = useState(0);
    const handleTabChange = (event, newValue) => setTab(newValue);
    const handleSwipeChange = index => setTab(index);

    const handleAddItemClick = useCallback(itemId => assignItem(itemId, userId));
    const handlRemoveItemClick = useCallback(itemId => assignItem(itemId, null));

    const [freeItems, handleFilterChange] = useSearchFilter(selectFilteredFreeItems);

    const [animateUser, setAnimateUser] = useState(false);
    useEffect(() => {
      const timeout = setTimeout(() => setAnimateUser(true), 2000);
      return () => clearTimeout(timeout);
    }, []);

    return (
      <Layout
        iconSrc="/assets/qr.svg"
        animateIcon={animateIcon}
        onIconAnimationEnd={onIconAnimationEnd}
        titleComponent={
          <>
            <div
              className={classNames('username-overlay-enter', {
                'username-overlay-exit': animateUser
              })}
            />
            <div
              className={classNames(classes.username, 'username-enter', {
                'username-exit': animateUser
              })}
            >
              <Typography
                variant="h6"
                color="textPrimary"
                align="center"
                className={classes.greeting}
              >
                Hey there,&nbsp;
              </Typography>
              <Typography variant="h6" color="textPrimary" align="center" className={classes.name}>
                {userName}
              </Typography>
            </div>
          </>
        }
      >
        <CloseButton onClick={onLogout} />
        <AppBar position="relative" color="default">
          <Tabs
            value={tab}
            onChange={handleTabChange}
            variant="fullWidth"
            indicatorColor="primary"
            textColor="primary"
            className={classes.tabs}
          >
            <Tab label={`Your items${userItems.length > 0 ? ` (${userItems.length})` : ''}`} />
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
            <div className={classes.tabTop}>
              <Typography color="textPrimary" gutterBottom variant="body2">
                Below are the devices that you’ve taken out. If you want to take/return a device,
                face the QR code on the back of the device towards the camera.
              </Typography>
            </div>
            <ItemList items={userItems} onItemClick={handlRemoveItemClick} height="100%" />
          </>
          <>
            <div className={classes.tabTop}>
              <Typography color="textPrimary" gutterBottom variant="body2">
                Here you can see all items still available. Click on + to reserve the item.
              </Typography>
              <div className={classes.searchContainer}>
                <SearchField onChange={handleFilterChange} />
              </div>
            </div>
            <div className={classes.tabContent}>
              <ItemList items={freeItems} onItemClick={handleAddItemClick} showAdd height="100%" />
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
  selectFilteredFreeItems: PropTypes.func.isRequired,
  userItems: PropTypes.array.isRequired
};

const mapStateToProps = state => {
  const user = selectActiveUser(state) || {};
  return {
    userId: user.id,
    userName: user.name,
    assignItemSuccess: selectNotifyAssignItemSuccess(state),
    selectFilteredFreeItems: createFreeItemsFilterSelector(state),
    userItems: selectUserItems(state)
  };
};

const mapDispatchToProps = {
  assignItem: actions.tryAssignItem,
  onLogout: actions.endSession
};

SessionPage.displayName = 'SessionPage';

export default connect(mapStateToProps, mapDispatchToProps)(SessionPage);
