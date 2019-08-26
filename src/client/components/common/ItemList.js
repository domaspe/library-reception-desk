import React from 'react';
import {
  Typography,
  IconButton,
  Paper,
  Grid,
  Box,
  Fade
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import moment from 'moment';
// eslint-disable-next-line import/no-extraneous-dependencies
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import {
  selectItems,
  selectFreeItems,
  selectActiveUserId,
  selectUserItems
} from '../../store/selectors';
import * as actions from '../../store/actions';

const useStyles = makeStyles(theme => ({
  listContainer: {
    height: '50vh',
    width: '100%',
    display: 'flex'
  },
  list: {
    maxHeight: '50vh',
    width: '100%',
    overflow: 'auto'
  },
  empty: {
    alignSelf: 'center',
    width: '100%'
  },
  item: {
    padding: theme.spacing(2),
    margin: theme.spacing(2),
    display: 'flex',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center'
  },
  user: {
    fontWeight: 'bold'
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

function shouldShowRemove(show, userId, dateTaken) {
  return (show === 'all' && dateTaken) || (show === 'taken' && userId);
}

function shouldShowAdd(show, userId) {
  return show === 'free' && userId;
}

const ItemList = ({ show, assignItem, ...props }) => {
  const { items, userId } = props;
  const classes = useStyles();
  return (
    <Box className={classes.listContainer}>
      <Box className={classes.list} style={{}}>
        <Fade in={!items.length}>
          <Box p={2} style={{ position: 'absolute', width: '100%' }}>
            <Typography
              color="textPrimary"
              align="center"
              gutterBottom
              className={classes.empty}
              variant="body2"
            >
              Wow, such empty
            </Typography>
          </Box>
        </Fade>
        <TransitionGroup>
          {items.map(item => {
            return (
              <CSSTransition key={item.id} timeout={200} classNames="item">
                <Paper
                  className={classes.item}
                  title={`${item.primaryTitle}\nBy ${item.secondaryTitle}`}
                >
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
                        <Typography className={classes.primaryTitle} noWrap>
                          {item.primaryTitle}
                        </Typography>
                        <Typography className={classes.secondaryTitle} noWrap>
                          {item.secondaryTitle}
                        </Typography>
                        {item.dateTaken ? (
                          <>
                            <Typography variant="caption">
                              Taken&nbsp;
                              {moment(item.dateTaken).format('MMM Do, hh:mm')}
                              &nbsp;by
                            </Typography>
                            &nbsp;
                            <Typography
                              variant="caption"
                              className={classes.user}
                            >
                              {item.user}
                            </Typography>
                          </>
                        ) : (
                          show === 'all' && (
                            <Typography variant="caption">&nbsp;</Typography>
                          )
                        )}
                      </Box>
                    </Grid>
                  </Grid>
                  {shouldShowRemove(show, userId, item.dateTaken) && (
                    <IconButton
                      color="primary"
                      onClick={() => assignItem(item.id, null)}
                    >
                      <CloseIcon />
                    </IconButton>
                  )}
                  {shouldShowAdd(show, userId) && (
                    <IconButton
                      color="primary"
                      onClick={() => assignItem(item.id, userId)}
                    >
                      <AddIcon />
                    </IconButton>
                  )}
                </Paper>
              </CSSTransition>
            );
          })}
        </TransitionGroup>
      </Box>
    </Box>
  );
};

ItemList.propTypes = {
  show: PropTypes.oneOf(['all', 'taken', 'free']).isRequired,
  assignItem: PropTypes.func.isRequired
};

const mapStateToProps = (state, ownProps) => {
  const userId = selectActiveUserId(state);
  return {
    items:
      // eslint-disable-next-line no-nested-ternary
      ownProps.show === 'all'
        ? selectItems(state, 'title')
        : ownProps.show === 'taken'
        ? selectUserItems(state, userId, 'dateTaken')
        : selectFreeItems(state, 'title'),
    userId
  };
};

const mapDispatchToProps = {
  assignItem: actions.tryAssignItem
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ItemList);
