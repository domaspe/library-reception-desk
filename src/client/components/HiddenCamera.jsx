import React from 'react';
import { connect } from 'react-redux';
import * as actions from '../store/actions';
import Video from './common/Video';

const HiddenCamera = ({ scanStart }) => {
  const faceCanvasRef = React.useRef();
  const qrCanvasRef = React.useRef();

  const start = React.useCallback(videoRef => {
    console.log('Start video');

    scanStart({
      videoRef,
      faceCanvasRef,
      qrCanvasRef
    });
  });

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events
    <div
      className="video-container hidden"
      onClick={evt => {
        if (evt.detail === 4) {
          document.getElementsByClassName('video-container')[0].classList.toggle('hidden');
        }
      }}
    >
      <Video onLoadedMetadata={start} width="640" height="480" />
      <canvas ref={faceCanvasRef} className="video-overlay" />
      <canvas ref={qrCanvasRef} className="video-overlay" />
    </div>
  );
};

const mapDispatchToProps = {
  scanStart: actions.scanStart
};

export default connect(
  null,
  mapDispatchToProps
)(HiddenCamera);
