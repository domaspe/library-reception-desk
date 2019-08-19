import React, { useState, useCallback } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { CircularProgress, TextField, Button } from '@material-ui/core';
import * as selectors from '../../store/selectors';
import * as actions from '../../store/actions';

const FaceScanPage = ({ progress, saveFaceStart, onCancel, isSendingData }) => {
  const [view, setView] = useState('name');
  const [name, setName] = useState('');

  const handleNameChange = useCallback(event => {
    setName(event.target.value);
  });

  const handleNameSubmit = useCallback(() => {
    setView('progress');
    saveFaceStart(name);
  }, [name]);

  return view === 'name' ? (
    <div>
      <form noValidate autoComplete="off" onSubmit={handleNameSubmit}>
        <TextField
          label="Name"
          value={name}
          onChange={handleNameChange}
          margin="normal"
          variant="outlined"
        />
        <Button variant="contained" color="primary" type="submit">
          Ok
        </Button>
        <Button variant="contained" color="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </form>
    </div>
  ) : (
    <div>
      Capturing your face
      {isSendingData ? (
        <CircularProgress />
      ) : (
        <CircularProgress variant="static" value={progress} />
      )}
    </div>
  );
};

FaceScanPage.propTypes = {
  progress: PropTypes.number.isRequired,
  saveFaceStart: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  isSendingData: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
  progress: selectors.selectFaceDataCollectedPercentage(state),
  isSendingData:
    selectors.selectIsUpdatingClass(state) ||
    selectors.selectIsLoadingUsers(state)
});

const mapDispatchToProps = {
  saveFaceStart: actions.saveFaceStart,
  onCancel: actions.startScanningFaces
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FaceScanPage);
