import React, { PropTypes } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import IconButton from 'material-ui/IconButton';
import GroupAddIcon from 'material-ui/svg-icons/social/group-add';

import TextField from 'material-ui/TextField';
import { withHandlers, withState, compose } from 'recompose';
import { connect } from 'react-redux';

const enhance = compose(
  withState('dailogOpen', 'toggleDailog', false),
  withState('tagText', 'setTagText', ''),
  withHandlers({
    toggleDailog: props => () => {
      props.toggleDailog(!props.dailogOpen);
    },
    onTagTextChange: props => event => {
      props.setTagText(event.target.value);
    },
    onNameTextChange: props => event => {
      const uid = props.selectNodes[0].uid;
      props.setDeviceName({
        name: event.target.value,
        uid,
      });
    },
  })
);

const Tagging = ({
  customName,
  tagText,
  toggleDailog,
  dailogOpen,
  onTagTextChange,
  onNameTextChange,
}) => {
  const actions = [
    <FlatButton label="Cancel" primary={true} onTouchTap={toggleDailog} />,
    <RaisedButton label="Submit" primary={true} disabled={true} onTouchTap={toggleDailog} />,
  ];
  return (
    <div>
      <IconButton
        tooltipPosition="bottom-left"
        tooltip="Tagging"
        onClick={toggleDailog}
      >
        <GroupAddIcon />
      </IconButton>
      <Dialog
        title="Taggin the select nodes"
        modal
        open={dailogOpen}
        actions={actions}
      >
        <h3>You select xxxx</h3>
        <TextField
          hintText="String"
          floatingLabelText="tag"
          onChange={onTagTextChange}
          defaultValue={tagText}
        />
        <TextField
          hintText="String"
          floatingLabelText="Custom Name"
          onChange={onNameTextChange}
          defaultValue={customName}
        />
      </Dialog>
    </div>
  );
};

Tagging.propTypes = {};

const mapStateToProps = state => ({
  slices: state.sliceManager,
});

const mapDispatchToProps = dispatch => ({
  setDeviceName: payload => dispatch({ type: 'SET_DEVICE_NAME', payload }),
});

export default connect(mapStateToProps, mapDispatchToProps)(enhance(Tagging));
