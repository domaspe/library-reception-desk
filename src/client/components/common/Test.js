/* eslint-disable */
import React from 'react';
import { connect } from 'react-redux';
import * as actions from '../../store/actions';

const Test = ({ assign, faceMatch, detect }) => {
  return (
    <div style={{ position: 'absolute', top: 0, right: 0 }}>
      <button
        onClick={() => {
          const code = prompt('code');
          const userId = prompt('userId', 'dpet');
          assign(code, userId);
        }}
      >
        SCAN
      </button>
      <button
        onClick={() => {
          const userId = prompt('userId', 'dpet');
          faceMatch(userId);
        }}
      >
        LOGIN
      </button>
      <button
        onClick={() => {
          detect(Math.random());
        }}
      >
        DETECT
      </button>
    </div>
  );
};
const mapDispatchToProps = {
  assign: actions.tryAssignItem,
  faceMatch: actions.faceMatchSuccess,
  detect: actions.faceDetectSuccess
};

export default connect(
  null,
  mapDispatchToProps
)(Test);
