import React from 'react';
import { connect } from 'react-redux';
import { Typography, Link } from '@material-ui/core';
import PropTypes from 'prop-types';
import * as actions from '../../store/actions';
import Layout from '../common/Layout';
import ChooseUserButton from '../common/ChooseUserButton';
import CreateNewUserButton from '../common/CreateNewUserButton';
import CloseButton from '../common/CloseButton';

const NotRecognizedPage = ({ onHelp, onClose }) => {
  return (
    <Layout
      iconSrc="/assets/faceid-sad.svg"
      actions={
        <>
          <ChooseUserButton />
          <CreateNewUserButton />
        </>
      }
      titleComponent={
        <Typography variant="h6" color="textPrimary" align="center">
          Can't recognize your face
        </Typography>
      }
    >
      <CloseButton onClick={onClose} />
      <Typography color="textPrimary">
        {'We didn’t recognize you. '}
        {
          <Link component="button" onClick={onHelp} variant="body1">
            Read more
          </Link>
        }
        {
          ' about why this might have happened or select one of the options below to continue.'
        }
      </Typography>
    </Layout>
  );
};

NotRecognizedPage.propTypes = {
  onHelp: PropTypes.func.isRequired
};

const mapDispatchToProps = {
  onHelp: actions.help,
  onClose: actions.startScanningFaces
};

export default connect(
  null,
  mapDispatchToProps
)(NotRecognizedPage);
