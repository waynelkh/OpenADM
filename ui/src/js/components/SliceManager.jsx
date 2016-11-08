import React from 'react';
import { bindActionCreators } from 'redux';
import { onlyUpdateForKeys, withHandlers, withState, compose } from 'recompose';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import ContentAdd from 'material-ui/svg-icons/content/add-circle';
import Edit from 'material-ui/svg-icons/image/edit';
import Delete from 'material-ui/svg-icons/action/delete';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import { connect } from 'react-redux';
import TextField from 'material-ui/TextField';
import * as SliceActions from '../actions/SliceAction';

const enhance = compose(
  withState('name', 'setName', props => props.name),
  withState('bandwidth', 'setBandWidth', props => props.bandwidth),
  withHandlers({
    onNameChange: props => event => {
      props.setName(event.target.value);
    },
    onBandWitdhChange: props => event => {
      props.setBandWidth(event.target.value);
    },
    onUpdateSlice: props => event => {
      props.updateSlice({
        [props.uuid]: { name: props.name, bandwidth: props.bandwidth, modify: false },
      });
    },
    onCancel: props => event => {
      props.cancelSlice(props.uuid);
    }
  })
);

const EditSliceField = enhance(
  ({ uuid, name, bandwidth, onNameChange, onBandWitdhChange, onUpdateSlice, onCancel }) =>
    <TableRow key={uuid}>
      <TableRowColumn>
        <TextField onChange={onNameChange} hintText="Name" value={name} id={`${name}-mac`} />
      </TableRowColumn>
      <TableRowColumn>
        <TextField onChange={onBandWitdhChange} hintText="Bandwidth" value={bandwidth} id={`${bandwidth}-bw`} />
      </TableRowColumn>
      <TableRowColumn>
        <FlatButton label="儲存" primary icon={<Edit />} onClick={onUpdateSlice} />
      </TableRowColumn>
      <TableRowColumn>
        <FlatButton label="放棄" secondary icon={<Delete />} onClick={onCancel} />
      </TableRowColumn>
    </TableRow>
);

const SliceManager = onlyUpdateForKeys(['slices', 'hidden'])(
  ({ slices, hidden, toggleSliceManager, addSlice, cancelSlice, modifySlice, delSlice, updateSlice }) => {
    return (
    <Dialog
      title="網路切片管理"
      modal={false}
      open={hidden.indexOf('SliceManager') === -1}
      actions={[
        <FlatButton
          label="close"
          onTouchTap={toggleSliceManager}
          keyboardFocused
          secondary
        />,
      ]}
      autoScrollBodyContent
    >
      <Table selectable={false}>
        <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
          <TableRow>
            <TableHeaderColumn columnNumber={1}>網路切片名稱</TableHeaderColumn>
            <TableHeaderColumn columnNumber={2}>頻寬需求 (kbps)</TableHeaderColumn>
            <TableHeaderColumn columnNumber={3}>+</TableHeaderColumn>
            <TableHeaderColumn columnNumber={4}>-</TableHeaderColumn>
          </TableRow>
        </TableHeader>
        <TableBody displayRowCheckbox={false}>
          {Object.keys(slices).map(k => (slices[k].modify) ?
            (<EditSliceField
              key={k}
              uuid={k}
              name={slices[k].name}
              bandwidth={slices[k].bandwidth}
              updateSlice={updateSlice}
              modifySlice={modifySlice}
              cancelSlice={cancelSlice}
            />
            ) :
            (
            <TableRow key={k}>
              <TableRowColumn>{slices[k].name}</TableRowColumn>
              <TableRowColumn>{slices[k].bandwidth}</TableRowColumn>
              <TableRowColumn><FlatButton label="編輯" primary icon={<Edit />}
                onClick={() => modifySlice(k)} />
              </TableRowColumn>
              <TableRowColumn>
                <FlatButton label="刪除" secondary icon={<Delete />}
                  onClick={() => delSlice({ name: slices[k].name, uuid: k }) }
                />
              </TableRowColumn>
            </TableRow>
            )
          )}
        </TableBody>
      </Table>
      <FlatButton label="新增切片" primary icon={<ContentAdd/>} onClick={() => addSlice()}/>
    </Dialog>)}
);

const mapStateToProps = state => ({
  slices: state.sliceManager,
});

const mapDispatchToProps = dispatch => bindActionCreators(SliceActions, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(SliceManager);
