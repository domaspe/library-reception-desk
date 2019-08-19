import React from 'react';
import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import CreateUser from './CreateUser';
import { selectCurrentView } from '../../store/selectors';
import { MAIN_VIEW, CREATE_USER_VIEW } from '../../constants';
import * as actions from '../../store/actions';
import UserPicker from './UserPicker';

const useStyles = makeStyles(() => ({
  container: {
    flex: 1,
    flexDirection: 'row',
    width: '100%'
  }
}));

const CreateNewUserButton = props => (
  <Button
    fullWidth
    variant="contained"
    color="primary"
    className={useStyles().button}
    type="submit"
    {...props}
  >
    Create New User
  </Button>
);

const ControlPanel = ({ view, setView }) => {
  const classes = useStyles();
  const handleCreateUser = React.useCallback(() => {
    setView(CREATE_USER_VIEW);
  }, [setView]);

  return (
    <div className={classes.container}>
      <UserPicker />
      {view === MAIN_VIEW && <CreateNewUserButton onClick={handleCreateUser} />}
      {view === CREATE_USER_VIEW && <CreateUser />}
    </div>
  );
};

const mapStateToProps = state => ({
  view: selectCurrentView(state)
});

const mapDispatchToProps = {
  setView: actions.setView
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ControlPanel);
