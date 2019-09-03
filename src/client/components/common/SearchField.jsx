import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import throttle from 'lodash.throttle';
import { usePrevious } from '../../utils/hooks';

const useStyles = makeStyles(theme => ({
  root: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    width: 250
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1
  },
  iconButton: {
    padding: 10
  }
}));

const SearchField = ({ onChange, open }) => {
  const classes = useStyles();
  const [value, setValue] = useState('');
  const onChangeThrottled = useCallback(throttle(onChange, 500));
  const clearSearch = useCallback(() => {
    setValue('');
    onChangeThrottled('');
  });
  const handleValueChange = useCallback(
    event => {
      const newValue = event.target.value;
      setValue(newValue);
      onChangeThrottled(newValue);
    },
    [onChange]
  );
  const nextOpen = usePrevious(open);
  useEffect(() => {
    if (!nextOpen && open) {
      clearSearch();
    }
  }, [nextOpen, open]);

  return (
    <Paper className={classes.root}>
      <InputBase
        className={classes.input}
        placeholder="Search items"
        onChange={handleValueChange}
        value={value}
      />
      <IconButton className={classes.iconButton} onClick={clearSearch}>
        {value.length > 0 ? <HighlightOffIcon /> : <SearchIcon />}
      </IconButton>
    </Paper>
  );
};

SearchField.propTypes = {
  onChange: PropTypes.func.isRequired,
  open: PropTypes.bool
};

SearchField.defaultProps = {
  open: true
};

export default SearchField;
