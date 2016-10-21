import React from 'react';
import { onlyUpdateForKeys } from 'recompose';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import ContentAdd from 'material-ui/svg-icons/content/add-circle';
import Edit from 'material-ui/svg-icons/image/edit';
import Delete from 'material-ui/svg-icons/action/delete';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';

const kbdStyle = {
  display: 'inline-block',
  padding: '3px 5px',
  font: '11px Consolas, "Liberation Mono", Menlo, Courier, monospace',
  lineHeight: '10px',
  color: '#555',
  verticalAlign: 'middle',
  backgroundColor: '#fcfcfc',
  border: 'solid 1px #ccc',
  borderBottomColor: '#bbb',
  borderRadius: '3px',
  boxShadow: 'inset 0 -1px 0 #bbb',
};

const tdStyle = {
  paddingTop: '3px',
  paddingBottom: '3px',
  lineHeight: '20px',
  verticalAlign: 'top',
};

const SliceManager = onlyUpdateForKeys(['hidden'])(
  ({ hidden, closeSliceManager }) =>
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
          <TableRow>
            <TableRowColumn>Slice1</TableRowColumn>
            <TableRowColumn>200M</TableRowColumn>
            <TableRowColumn><FlatButton label="編輯" primary icon={<Edit/>} /></TableRowColumn>
            <TableRowColumn><FlatButton label="刪除" secondary icon={<Delete/>}/></TableRowColumn>
          </TableRow>
          <TableRow>
            <TableRowColumn>Slice2</TableRowColumn>
          <TableRowColumn>300M</TableRowColumn>
          <TableRowColumn><FlatButton label="編輯" primary icon={<Edit/>} /></TableRowColumn>
          <TableRowColumn><FlatButton label="刪除" secondary icon={<Delete/>}/></TableRowColumn>
          </TableRow>
        </TableBody>
      </Table>
      <FlatButton label="新增切片" primary icon={<ContentAdd/>}/>
    </Dialog>
);

export default SliceManager;
