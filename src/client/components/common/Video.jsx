import React, { useEffect, useCallback } from 'react';

const Video = ({ onLoadedMetadata, ...props }) => {
  const videoRef = React.useRef();

  useEffect(() => {
    if (navigator.mediaDevices && videoRef.current) {
      navigator.mediaDevices.getUserMedia({ video: {} }).then(stream => {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      });
    }
  }, [videoRef]);

  const start = useCallback(() => {
    if (onLoadedMetadata) {
      onLoadedMetadata(videoRef);
    }
  }, [onLoadedMetadata]);

  return <video ref={videoRef} autoPlay muted {...props} onLoadedMetadata={start} />;
};

export default Video;
