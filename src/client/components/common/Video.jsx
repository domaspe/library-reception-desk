import React, { useEffect, useCallback } from 'react';

const Video = ({ onLoadedMetadata, ...props }) => {
  const videoRef = React.useRef();

  useEffect(() => {
    if (navigator.mediaDevices && videoRef.current) {
      navigator.mediaDevices.enumerateDevices().then(devices => {
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        if (videoDevices.length > 1) {
          return {
            video: {
              deviceId: {
                exact: videoDevices[videoDevices.length - 1].deviceId
              }
            }
          }
        }

        return {
          video: {}
        }
      }).then(constraints => {
        return navigator.mediaDevices.getUserMedia(constraints);
      })
      .then(stream => {
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
