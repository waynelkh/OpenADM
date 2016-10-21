import React from 'react';
import { onlyUpdateForKeys } from 'recompose';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import ContentAdd from 'material-ui/svg-icons/content/add-circle';
import Edit from 'material-ui/svg-icons/image/edit';
import Delete from 'material-ui/svg-icons/action/delete';
import { Tabs, Tab } from 'material-ui/Tabs';
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

const SliceDeviceManager = onlyUpdateForKeys(['hidden'])(
  ({ hidden, closeSliceDeviceManager }) =>
    <Dialog
      title="切片裝置管理"
      modal={false}
      open={hidden.indexOf('SliceDeviceManager') === -1}
      actions={[
        <FlatButton
          label="close"
          onTouchTap={closeSliceDeviceManager}
          keyboardFocused
          secondary
        />,
      ]}
      autoScrollBodyContent
    >
      <Tabs>
        <Tab label="Slice1" >
          <Table selectable={false}>
            <TableHeader displaySelectAll={false} adjustForCheckbox={true}>
              <TableRow>
                <TableHeaderColumn columnNumber={1}>MAC Address</TableHeaderColumn>
                <TableHeaderColumn columnNumber={2}>+</TableHeaderColumn>
                <TableHeaderColumn columnNumber={3}>-</TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody displayRowCheckbox={false}>
              <TableRow>
                <TableRowColumn>00:00:00:00:00:01</TableRowColumn>
                <TableRowColumn><FlatButton label="編輯" primary icon={<Edit/>} /></TableRowColumn>
                <TableRowColumn><FlatButton label="刪除" secondary icon={<Delete/>}/></TableRowColumn>
              </TableRow>
              <TableRow>
                <TableRowColumn>00:00:00:00:00:02</TableRowColumn>
                <TableRowColumn><FlatButton label="編輯" primary icon={<Edit/>} /></TableRowColumn>
                <TableRowColumn><FlatButton label="刪除" secondary icon={<Delete/>}/></TableRowColumn>
              </TableRow>
            </TableBody>
          </Table>
          <FlatButton label="新增裝置" primary icon={<ContentAdd/>}/>
        </Tab>
        <Tab label="Slice2" >
          <Table selectable={false}>
            <TableHeader displaySelectAll={false} adjustForCheckbox={true}>
              <TableRow>
                <TableHeaderColumn columnNumber={1}>MAC Address</TableHeaderColumn>
                <TableHeaderColumn columnNumber={2}>+</TableHeaderColumn>
                <TableHeaderColumn columnNumber={3}>-</TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody displayRowCheckbox={false}>
              <TableRow>
                <TableRowColumn>00:00:00:00:00:01</TableRowColumn>
                <TableRowColumn><FlatButton label="編輯" primary icon={<Edit/>} /></TableRowColumn>
                <TableRowColumn><FlatButton label="刪除" secondary icon={<Delete/>}/></TableRowColumn>
              </TableRow>
              <TableRow>
                <TableRowColumn>00:00:00:00:00:02</TableRowColumn>
                <TableRowColumn><FlatButton label="編輯" primary icon={<Edit/>} /></TableRowColumn>
                <TableRowColumn><FlatButton label="刪除" secondary icon={<Delete/>}/></TableRowColumn>
              </TableRow>
              <TableRow>
                <TableRowColumn>00:00:00:00:00:03</TableRowColumn>
                <TableRowColumn><FlatButton label="編輯" primary icon={<Edit/>} /></TableRowColumn>
                <TableRowColumn><FlatButton label="刪除" secondary icon={<Delete/>}/></TableRowColumn>
              </TableRow>
            </TableBody>
          </Table>
          <FlatButton label="新增裝置" primary icon={<ContentAdd/>}/>
        </Tab>
      </Tabs>
    </Dialog>
);

export default SliceDeviceManager;
