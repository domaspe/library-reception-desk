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
import PropTypes from 'prop-types';
import moment from 'moment';
// eslint-disable-next-line import/no-extraneous-dependencies
import { CSSTransition, TransitionGroup } from 'react-transition-group';

const useStyles = makeStyles(theme => ({
  listContainer: {
    height: '50vh',
    width: '100%',
    display: 'flex'
  },
  list: {
    maxHeight: '50vh',
    width: '100%',
    overflowY: 'auto',
    overflowX: 'hidden'
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
    alignItems: 'center',
    height: 100
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
    backgroundPosition: 'center'
  },
  itemContent: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%'
  },
  thumbnailContainer: {
    width: 90,
    height: '100%'
  },
  descriptionContainer: {
    flex: 1
  }
}));

const ItemList = ({ onItemClick, items, showAdd, height }) => {
  const classes = useStyles();
  return (
    <Box className={classes.listContainer} style={{ height }}>
      <Box className={classes.list} style={{ maxHeight: height }}>
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
              <CSSTransition key={item.id} timeout={300} classNames="item">
                <Paper
                  className={classes.item}
                  title={`${item.primaryTitle}\nBy ${item.secondaryTitle}`}
                >
                  <div className={classes.itemContent}>
                    <div className={classes.thumbnailContainer}>
                      <Box
                        className={classes.thumbnail}
                        style={{
                          backgroundImage: `url("/data/thumbnails/${item.thumbnail}")`
                        }}
                      />
                    </div>
                    <div className={classes.descriptionContainer}>
                      <Box className={classes.description}>
                        <Typography className={classes.primaryTitle} noWrap>
                          {item.primaryTitle}
                        </Typography>
                        <Typography className={classes.secondaryTitle} noWrap>
                          {item.secondaryTitle}
                        </Typography>
                        {!!item.dateTaken && (
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
                        )}
                      </Box>
                    </div>
                  </div>
                  {showAdd && (
                    <IconButton
                      color="primary"
                      onClick={() => onItemClick(item.id)}
                    >
                      <AddIcon />
                    </IconButton>
                  )}
                  {!showAdd && !!item.dateTaken && (
                    <IconButton
                      color="primary"
                      onClick={() => onItemClick(item.id)}
                    >
                      <CloseIcon />
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
  onItemClick: PropTypes.func.isRequired,
  items: PropTypes.array.isRequired,
  showAdd: PropTypes.bool,
  height: PropTypes.any
};

export default ItemList;
