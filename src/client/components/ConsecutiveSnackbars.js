import React from 'react';
import { connect } from 'react-redux';
import { Snackbar, Slide } from '@material-ui/core';
import { selectNotificationMessage, selectNotificationKey } from '../store/selectors';
import { TIMEOUT_AFTER_ASSIGN } from '../constants';

function TransitionDown(props) {
  return <Slide {...props} direction="down" />;
}

const ConsecutiveSnackbars = ({ messageKey, message }) => {
  const queueRef = React.useRef([]);
  const [state, setState] = React.useState({
    open: false,
    messageInfo: {}
  });

  const processQueue = () => {
    if (queueRef.current.length > 0) {
      setState({
        ...state,
        messageInfo: queueRef.current.shift(),
        open: true
      });
    }
  };

  const handleNewMessage = (newKey, newMessage) => {
    queueRef.current.push({
      message: newMessage,
      key: newKey
    });

    if (state.open) {
      setState({
        ...state,
        open: false
      });
    } else {
      processQueue();
    }
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setState({
      ...state,
      open: false
    });
  };

  const handleExited = () => {
    processQueue();
  };

  React.useEffect(() => {
    if (!message) {
      return;
    }

    handleNewMessage(messageKey, message);
  }, [messageKey, message]);

  return (
    <Snackbar
      key={state.messageInfo.key}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'center'
      }}
      open={state.open}
      autoHideDuration={TIMEOUT_AFTER_ASSIGN}
      onClose={handleClose}
      onExited={handleExited}
      message={<span>{state.messageInfo.message}</span>}
      TransitionComponent={TransitionDown}
    />
  );
};

const mapStateToProps = state => ({
  message: selectNotificationMessage(state),
  messageKey: selectNotificationKey(state)
});

export default connect(mapStateToProps)(ConsecutiveSnackbars);
