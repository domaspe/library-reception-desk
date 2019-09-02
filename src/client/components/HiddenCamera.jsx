import React from 'react';
import { connect } from 'react-redux';
import * as actions from '../store/actions';

const HiddenCamera = ({ scanStart }) => {
  const videoRef = React.useRef();
  const faceCanvasRef = React.useRef();
  const qrCanvasRef = React.useRef();

  React.useEffect(() => {
    if (navigator.mediaDevices && videoRef.current) {
      navigator.mediaDevices.getUserMedia({ video: {} }).then(stream => {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      });
    }
  }, [videoRef]);

  const start = React.useCallback(() => {
    console.log('Start video');

    scanStart({
      videoRef,
      faceCanvasRef,
      qrCanvasRef
    });
  });

  return (
    <div className="smart-camera-container">
      <video
        ref={videoRef}
        onLoadedMetadata={start}
        autoPlay
        muted
        width="640"
        height="480"
      />
      <canvas ref={faceCanvasRef} className="smart-camera-overlay" />
      <canvas ref={qrCanvasRef} className="smart-camera-overlay" />
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
