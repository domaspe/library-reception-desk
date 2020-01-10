import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import * as actions from '../store/actions';
import Video from './common/Video';

// Temp hakish function to save temp camera window on screen
function useStoredCameraClass() {
  const [cameraClass, setCameraClass] = useState('');
  useEffect(() => {
    const storedClass = sessionStorage.getItem('temp-camera-class');
    if (storedClass === null) {
      return;
    }

    setCameraClass(storedClass);
  }, []);
  useEffect(() => {
    sessionStorage.setItem('temp-camera-class', cameraClass);
  }, [cameraClass]);

  const toggleCameraClass = () => setCameraClass(cameraClass ? '' : 'hidden');

  return [cameraClass, toggleCameraClass];
}

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

  const [cameraClass, toggleCameraClass] = useStoredCameraClass();

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events
    <div
      className={`video-container ${cameraClass}`}
      onClick={evt => {
        if (evt.detail === 3) {
          toggleCameraClass();
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

export default connect(null, mapDispatchToProps)(HiddenCamera);
