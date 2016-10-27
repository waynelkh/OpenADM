import React from 'react';
import { onlyUpdateForKeys ,withHandlers, withState, compose } from 'recompose';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import ContentAdd from 'material-ui/svg-icons/content/add-circle';
import Edit from 'material-ui/svg-icons/image/edit';
import Delete from 'material-ui/svg-icons/action/delete';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import { connect } from 'react-redux';
import TextField from 'material-ui/TextField';

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
    onDiscard: props => event => {
      props.updateSlice({
        [props.uuid]: { name: props.name, bandwidth: props.bandwidth, modify: false },
      });
    }
  })
);

const EditSliceField = enhance(
  ({ uuid, name, bandwidth, onNameChange, onBandWitdhChange, onUpdateSlice, onDiscard }) =>
  <TableRow key={uuid}>
    <TableRowColumn>
      <TextField onChange={onNameChange} value={name}/>
      </TableRowColumn>
    <TableRowColumn><TextField onChange={onBandWitdhChange} value={bandwidth} /></TableRowColumn>
    <TableRowColumn>
      <FlatButton label="儲存" primary icon={<Edit/>} onClick={onUpdateSlice} />
    </TableRowColumn>
    <TableRowColumn>
      <FlatButton label="放棄" secondary icon={<Delete/>} onClick={onDiscard} />
    </TableRowColumn>
  </TableRow>
);

const SliceManager = onlyUpdateForKeys(['slices', 'hidden'])(
  ({ slices, hidden, closeSliceManager, addSlice, delSlice, updateSlice }) =>
    <Dialog
      title="網路切片管理"
      modal={false}
      open={hidden.indexOf('SliceManager') === -1}
      actions={[
        <FlatButton
          label="close"
          onTouchTap={closeSliceManager}
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
            <TableHeaderColumn columnNumber={2}>頻寬需求</TableHeaderColumn>
            <TableHeaderColumn columnNumber={3}>+</TableHeaderColumn>
            <TableHeaderColumn columnNumber={4}>-</TableHeaderColumn>
          </TableRow>
        </TableHeader>
        <TableBody displayRowCheckbox={false}>
          {Object.keys(slices).map(k => (slices[k].modify) ?
            (<EditSliceField uuid={k} name={slices[k].name} bandwidth={slices[k].bandwidth}
              updateSlice={updateSlice} delSlice={delSlice} />
            ) :
            (
            <TableRow key={k}>
              <TableRowColumn>{slices[k].name}</TableRowColumn>
              <TableRowColumn>{slices[k].bandwidth}</TableRowColumn>
              <TableRowColumn><FlatButton label="編輯" primary icon={<Edit/>}
                onClick={() => updateSlice({
                  [k]: { ...slices[k], modify: true },
                })}/>
              </TableRowColumn>
              <TableRowColumn>
                <FlatButton label="刪除" secondary icon={<Delete/>} onClick={() => delSlice(k) }/>
              </TableRowColumn>
            </TableRow>
            )
          )}
        </TableBody>
      </Table>
      <FlatButton label="新增切片" primary icon={<ContentAdd/>} onClick={() => addSlice()}/>
    </Dialog>
);

const mapStateToProps = (state) => ({
  slices: state.sliceManager,
});

const mapDispatchToProps = dispatch => ({
  addSlice: () => dispatch({ type: 'ADD_SLICE' }),
  delSlice: (payload) => dispatch({ type: 'DEL_SLICE', payload }),
  updateSlice: (payload) => dispatch({ type: 'UPDATE_SLICE', payload }),
});

export default connect(mapStateToProps, mapDispatchToProps)(SliceManager);
