import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Typography,
  Tabs,
  Tab,
  Box,
  AppBar,
  Badge
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import SwipeableViews from 'react-swipeable-views';
import AddIcon from '@material-ui/icons/Add';
import {
  selectActiveUserId,
  selectNotifyAssignItemSuccess,
  selectFreeItems,
  selectUserItems
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
    padding: theme.spacing(2, 2, 0, 2)
  },
  tabContent: {
    paddingBottom: theme.spacing(2)
  },
  badge: {
    padding: theme.spacing(0, 2)
  }
}));

const SessionPage = ({
  userId,
  onLogout,
  freeItems,
  userItems,
  assignItemSuccess,
  assignItem
}) => {
  const classes = useStyles();
  const [animateIcon, onIconAnimationEnd] = useIconAnimation(assignItemSuccess);
  const [tab, setTab] = React.useState(0);
  const handleTabChange = (event, newValue) => setTab(newValue);
  const handleSwipeChange = index => setTab(index);

  const handleAddItemClick = useCallback(itemId => assignItem(itemId, userId));
  const handlRemoveItemClick = useCallback(itemId => assignItem(itemId, null));

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
        <Box>
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
        </Box>
      </SwipeableViews>
    </Layout>
  );
};

SessionPage.propTypes = {
  onLogout: PropTypes.func.isRequired,
  assignItem: PropTypes.func.isRequired,
  userId: PropTypes.string.isRequired,
  freeItems: PropTypes.array.isRequired,
  userItems: PropTypes.array.isRequired
};

const mapStateToProps = state => {
  const userId = selectActiveUserId(state);
  return {
    userId,
    assignItemSuccess: selectNotifyAssignItemSuccess(state),
    freeItems: selectFreeItems(state, 'title'),
    userItems: selectUserItems(state, userId, 'dateTaken')
  };
};

const mapDispatchToProps = {
  assignItem: actions.tryAssignItem,
  onLogout: actions.endSession
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SessionPage);
