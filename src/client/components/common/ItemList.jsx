import React from 'react';
import { Typography, IconButton, Paper, Box, Fade } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';
import PropTypes from 'prop-types';
import moment from 'moment';
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';
import List from 'react-virtualized/dist/commonjs/List';

const useStyles = makeStyles(theme => ({
  listContainer: {
    height: '50vh',
    width: '100%',
    display: 'flex'
  },
  list: {
    //    maxHeight: '60vh',
    width: '100%',
    overflowY: 'auto',
    overflowX: 'hidden'
  },
  empty: {
    alignSelf: 'center',
    width: '100%'
  },
  itemContainer: {
    padding: theme.spacing(2, 2, 1, 2)
  },
  item: {
    padding: theme.spacing(0, 2, 0, 2),
    display: 'flex',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%'
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
    width: 60,
    height: '100%'
  },
  descriptionContainer: {
    width: 0, // makes noWrap work for some reason o_O
    flex: 1,
    marginLeft: theme.spacing(2)
  }
}));

const ItemList = ({ onItemClick, items, showAdd, height: componentHeight }) => {
  const classes = useStyles();
  const rowRenderer = ({ index, style }) => {
    const item = items[index];
    return (
      <div className={classes.itemContainer} style={style} key={item.id}>
        <Paper
          className={classes.item}
          title={`${item.primaryTitle}\nBy ${item.secondaryTitle}`}
        >
          <div className={classes.itemContent}>
            <div className={classes.thumbnailContainer}>
              <Box
                className={classes.thumbnail}
                style={{
                  backgroundImage: `url("${item.thumbnailUrl}")`
                }}
              />
            </div>
            <div className={classes.descriptionContainer}>
              <Typography className={classes.primaryTitle} noWrap>
                {item.primaryTitle}
              </Typography>
              <Typography className={classes.secondaryTitle} noWrap>
                {item.secondaryTitle}
              </Typography>
              {!!item.user && (
                <Typography variant="caption" noWrap>
                  {'Taken '}
                  {moment(item.timeTaken).format('MMM Do, hh:mm')}
                  {' by '}
                  <span className={classes.user}>{item.user.name}</span>
                </Typography>
              )}
            </div>
            {showAdd && (
              <IconButton color="primary" onClick={() => onItemClick(item.id)}>
                <AddIcon />
              </IconButton>
            )}
            {!showAdd && !!item.timeTaken && (
              <IconButton color="primary" onClick={() => onItemClick(item.id)}>
                <CloseIcon />
              </IconButton>
            )}
          </div>
        </Paper>
      </div>
    );
  };

  const emptyRenderer = () => (
    <Fade in={!items.length}>
      <Box p={2} style={{ width: '100%' }}>
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
  );

  return (
    <Box className={classes.listContainer} style={{ height: componentHeight }}>
      <AutoSizer>
        {({ height, width }) => (
          <List
            className={classes.list}
            height={height}
            width={width}
            noRowsRenderer={emptyRenderer}
            rowCount={items.length}
            estimatedRowSize={120}
            rowHeight={120}
            rowRenderer={rowRenderer}
            style={{ outline: 'none' }}
          />
        )}
      </AutoSizer>
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
