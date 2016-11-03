import React from 'react';
import { onlyUpdateForKeys, withHandlers, withState, compose } from 'recompose';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import ContentAdd from 'material-ui/svg-icons/content/add-circle';
import Edit from 'material-ui/svg-icons/image/edit';
import Delete from 'material-ui/svg-icons/action/delete';
import { Tabs, Tab } from 'material-ui/Tabs';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import TextField from 'material-ui/TextField';
import * as SliceEntryActions from '../actions/SliceEntryAction';

const enhance = compose(
  withState('mac', 'setMac', props => props.mac),
  withHandlers({
    onMacChange: props => (event) => {
      props.setMac(event.target.value);
    },
    onUpdateDevice: props => () => {
      props.updateDevice({
        slice: props.slice,
        uuid: props.uuid,
        mac: props.mac,
      });
    },
    onCancel: props => () => {
      props.cancelDevice({ slice: props.slice, uuid: props.uuid });
    },
  })
);

const EditDeviceField = enhance(
  ({ uuid, mac, onMacChange, onUpdateDevice, onCancel }) =>
    <TableRow key={uuid}>
      <TableRowColumn>
        <TextField onChange={onMacChange} value={mac} id={uuid} />
      </TableRowColumn>
      <TableRowColumn>
        <FlatButton label="儲存" primary icon={<Edit />} onClick={onUpdateDevice} />
      </TableRowColumn>
      <TableRowColumn>
        <FlatButton label="放棄" secondary icon={<Delete />} onClick={onCancel} />
      </TableRowColumn>
    </TableRow>
);

const SliceDeviceManager =
  ({
    hidden,
    toggleSliceDeviceManager,
    devices,
    getAllSliceEntry,
    addDevice,
    cancelDevice,
    modifyDevice,
    updateDevice,
    delDevice,
  }) => (
    <Dialog
      title="切片裝置管理"
      modal={false}
      open={hidden.indexOf('SliceDeviceManager') === -1}
      actions={[
        <FlatButton
          label="reload"
          onTouchTap={getAllSliceEntry}
        />,
        <FlatButton
          label="close"
          onTouchTap={toggleSliceDeviceManager}
          keyboardFocused
          secondary
        />,
      ]}
      autoScrollBodyContent
    >
      <Tabs>
        {Object.keys(devices).map(slice => (
          <Tab label={slice} >
            <Table selectable={false}>
              <TableHeader displaySelectAll={false} adjustForCheckbox>
                <TableRow>
                  <TableHeaderColumn columnNumber={1}>MAC Address</TableHeaderColumn>
                  <TableHeaderColumn columnNumber={2}>+</TableHeaderColumn>
                  <TableHeaderColumn columnNumber={3}>-</TableHeaderColumn>
                </TableRow>
              </TableHeader>
              <TableBody displayRowCheckbox={false}>
                {Object.keys(devices[slice]).map(uuid =>
                  devices[slice][uuid].modify ?
                  <EditDeviceField
                    slice={slice}
                    uuid={uuid}
                    mac={devices[slice][uuid].mac}
                    updateDevice={updateDevice}
                    modifyDevice={modifyDevice}
                    cancelDevice={cancelDevice}
                  /> :
                  <TableRow key={uuid}>
                    <TableRowColumn>{devices[slice][uuid].mac}</TableRowColumn>
                    <TableRowColumn>
                      <FlatButton label="編輯" primary icon={<Edit />}
                        onClick={() => modifyDevice({ slice, uuid })}
                      />
                    </TableRowColumn>
                    <TableRowColumn>
                      <FlatButton
                        label="刪除"
                        secondary icon={<Delete />}
                        onClick={() => delDevice({ slice, uuid, mac: devices[slice][uuid].mac }) }
                      />
                    </TableRowColumn>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <FlatButton label="新增裝置" primary icon={<ContentAdd/>} onClick={() => addDevice(slice)}/>
          </Tab>
        ))}
      </Tabs>
    </Dialog>
);


const mapStateToProps = state => ({
  devices: state.sliceDeviceManager,
});

const mapDispatchToProps = dispatch => bindActionCreators(SliceEntryActions, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(SliceDeviceManager);
