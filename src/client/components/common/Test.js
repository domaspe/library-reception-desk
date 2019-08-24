/* eslint-disable */
import React from 'react';
import { connect } from 'react-redux';
import * as actions from '../../store/actions';

const Test = ({ assign }) => {
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, zIndex: 999999 }}>
      <button
        onClick={() => {
          const code = prompt('code');
          const userId = prompt('userId', 'dpet');
          assign(code, userId);
        }}
      >
        SCAN
      </button>
    </div>
  );
};
const mapDispatchToProps = {
  assign: actions.tryAssignItem
};

export default connect(
  null,
  mapDispatchToProps
)(Test);
