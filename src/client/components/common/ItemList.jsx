import { Box, ButtonBase, Fade, Grow, Paper, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';
import List from 'react-virtualized/dist/commonjs/List';

const useStyles = makeStyles(theme => ({
  listContainer: {
    height: '65vh',
    width: '100%',
    display: 'flex',
    flex: 1
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
  itemButton: {
    // margin: theme.spacing(2, 2, 0.5, 2),
    textAlign: 'left',
    display: 'block',
    width: '100%',
    height: '100%'
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

function createTitle({ primaryTitle, secondaryTitle, description }) {
  return [primaryTitle, secondaryTitle, description && `\n${description}`]
    .filter(item => item)
    .join('\n');
}

const ItemList = ({ onItemClick, items, showAdd, height: componentHeight, animate }) => {
  const classes = useStyles();
  const [outId, setOutId] = useState(null);
  useEffect(() => {
    setOutId(null);
  }, [items.length]);

  const handleItemClick = useCallback(
    id => {
      if (animate) {
        setOutId(id);
        return;
      }

      onItemClick(id);
    },
    [animate]
  );
  const handleItemExit = useCallback(() => {
    onItemClick(outId);
  }, [outId]);

  const rowRenderer = ({ index, style }) => {
    const item = items[index];
    const itemComponent = (
      <Box px={2} pt={2} pb={0.5} style={style} display="flex" alignItems="stretch">
        <ButtonBase
          key={item.id}
          className={classes.itemButton}
          onClick={() => handleItemClick(item.id)}
        >
          {/* <div focusRipple onClick={() => handleItemClick(item.id)}> */}
          <Paper className={classes.item} title={createTitle(item)}>
            <div className={classes.itemContent}>
              <div className={classes.thumbnailContainer}>
                <Box
                  className={classes.thumbnail}
                  style={{
                    backgroundImage: item.thumbnailUrl ? `url("${item.thumbnailUrl}")` : undefined
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
                {!!item.takenByUser && (
                  <Typography variant="caption" noWrap>
                    {'Taken '}
                    {moment(item.timeTaken).format('MMM Do, HH:mm')}
                    {' by '}
                    <span className={classes.user}>{item.takenByUser.name}</span>
                  </Typography>
                )}
              </div>
              {showAdd && <AddIcon fontSize="large" color="primary" />}
              {!showAdd && !!item.timeTaken && <RemoveIcon fontSize="large" color="primary" />}
            </div>
          </Paper>
          {/* </div> */}
        </ButtonBase>
      </Box>
    );

    if (animate) {
      return (
        <Grow
          enter={false}
          in={!outId || item.id !== outId}
          onExit={handleItemExit}
          key={`${item.id}_grow`}
          appear={false}
        >
          {itemComponent}
        </Grow>
      );
    }

    return itemComponent;
  };

  const emptyRenderer = () => (
    <Fade in={!items.length} style={{ height: '100%' }}>
      <Box p={2} style={{ width: '100%', height: '100%', display: 'flex' }}>
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
            className={`${classes.list} scrollbox`}
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
  height: PropTypes.any,
  animate: PropTypes.bool
};

ItemList.defaultProps = {
  animate: true
};

export default ItemList;
