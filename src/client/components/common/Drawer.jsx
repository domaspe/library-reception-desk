import React, { useCallback, useState, useEffect } from 'react';
import {
  Drawer as MUIDrawer,
  IconButton,
  AppBar,
  Tabs,
  Tab,
  Typography,
  Toolbar
} from '@material-ui/core';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import { makeStyles } from '@material-ui/core/styles';
import SwipeableViews from 'react-swipeable-views';

import { selectIsItemsDrawerOpen } from '../../store/selectors';
import * as actions from '../../store/actions';
import DrawerItems from './DrawerItems';
import Statistics from './Statistics';
import Icon from './Icon';

const useStyles = makeStyles(theme => ({
  icon: {
    marginRight: theme.spacing(2)
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  drawerName: {
    display: 'flex',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  close: {},
  content: {
    backgroundColor: theme.palette.background.paper,
    width: '90vw',
    height: '100%'
  },
  swipeableSlide: {
    height: '100%'
  },
  tabs: {
    flex: 1
  },
  toolbar: {
    flex: 1,
    display: 'flex',
    justifyContent: 'space-between'
  },
  logo: {
    display: 'flex'
  },
  name: {
    paddingLeft: theme.spacing(1)
  }
}));

const Drawer = ({ open, setDrawerOpen }) => {
  const classes = useStyles();
  const handleClose = useCallback(() => setDrawerOpen(false));

  const [tab, setTab] = useState(0);
  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };
  const handleSwipeChange = index => {
    setTab(index);
  };
  useEffect(() => {
    if (open) {
      setTab(0);
    }
  }, [open]);

  return (
    <MUIDrawer open={open} onClose={handleClose}>
      <div className={classes.drawerHeader}>
        <AppBar color="default" position="static">
          <Toolbar className={classes.toolbar}>
            <div className={classes.logo}>
              <Icon src="/assets/knopka.png" size={35} />
              <Typography variant="h6" color="textPrimary" className={classes.name}>
                Knopka 2
              </Typography>
            </div>
            <IconButton onClick={handleClose} className={classes.close} edge="end">
              <ChevronLeftIcon fontSize="large" />
            </IconButton>
          </Toolbar>
          <Tabs
            value={tab}
            onChange={handleTabChange}
            variant="fullWidth"
            indicatorColor="primary"
            textColor="primary"
            className={classes.tabs}
          >
            <Tab label="Taken Items" />
            <Tab label="Fun Statistics" />
          </Tabs>
        </AppBar>
      </div>

      <SwipeableViews
        index={tab}
        onChangeIndex={handleSwipeChange}
        containerStyle={{ height: '100%' }}
        className={classes.content}
        slideClassName={classes.swipeableSlide}
      >
        <DrawerItems visible={open} />
        <Statistics visible={open} />
      </SwipeableViews>
    </MUIDrawer>
  );
};

Drawer.propTypes = {
  setDrawerOpen: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
  open: selectIsItemsDrawerOpen(state)
});

const mapDispatchToProps = {
  setDrawerOpen: actions.setItemsDrawerOpen
};

export default connect(mapStateToProps, mapDispatchToProps)(Drawer);
