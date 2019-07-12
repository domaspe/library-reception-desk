import React from 'react';
import { connect } from 'react-redux';
import * as actions from '../store/actions';

const DetectionCamera = ({ width: preferredWidth, scanStart }) => {
  const videoRef = React.useRef();
  const faceCanvasRef = React.useRef();
  const qrCanvasRef = React.useRef();
  const [preferredHeight, setPreferredHeight] = React.useState(0);

  React.useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: {} }).then(stream => {
      videoRef.current.srcObject = stream;
      videoRef.current.play();
    });
  }, [videoRef]);

  const start = React.useCallback(() => {
    console.log('Start video');

    const preferredSizeRatio = preferredWidth / videoRef.current.videoWidth;
    const height = videoRef.current.videoHeight * preferredSizeRatio;
    setPreferredHeight(height);

    scanStart({
      videoRef,
      faceCanvasRef,
      qrCanvasRef,
      mediaWidth: preferredWidth,
      mediaHeight: height
    });
  });

  return (
    <div
      className="smart-camera-container mirror"
      style={{
        width: preferredWidth,
        height: preferredHeight
      }}
    >
      <video
        ref={videoRef}
        onLoadedMetadata={start}
        autoPlay
        muted
        width={preferredWidth}
        height={preferredHeight}
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
)(DetectionCamera);
