import React from 'react';
import { connect } from 'react-redux';
import * as actions from '../store/actions';

const FaceControlls = ({ saveFace }) => {
  const handleClick = React.useCallback(() => {
    const label = prompt('Identifier');
    if (!label) return;

    saveFace(label);
  }, [saveFace]);

  // eslint-disable-next-line react/button-has-type
  return <button onClick={handleClick}>Save Face</button>;
};

const mapDispatchToProps = {
  saveFace: actions.saveFace
};

export default connect(
  null,
  mapDispatchToProps
)(FaceControlls);
