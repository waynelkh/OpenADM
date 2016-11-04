import React, { PropTypes } from 'react';
import { onlyUpdateForKeys, compose } from 'recompose';

import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import Divider from 'material-ui/Divider';
import ArrowDropLeft from 'material-ui/svg-icons/hardware/keyboard-arrow-left';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import Keyboard from 'material-ui/svg-icons/hardware/keyboard';

import { iconMap } from '../../constant/moduleMapping';
/**
 * Example of nested menus within an IconMenu.
 */

const moduleList = [
  'Flowtable',
  'ControllerStatus',
  'Detail',
  'PortStatus',
  'SettingController',
];
const ModuleButton = onlyUpdateForKeys(['hidden'])(
  ({ hidden, togglePanel, showSliceManager, showSliceDeviceManager }) => {
    const childButtons = moduleList.map((data, index) => (
      <MenuItem
        key={`child-${index}`}
        icon={iconMap[data]}
        primaryText={data}
        onClick={() => togglePanel(data)}
      />));
    return (
      <div
        style={{
          position: 'fixed',
          right: '30px',
          bottom: '30px',
          zIndex: 10000,
        }}>
        <IconMenu
          iconButtonElement={
            <IconButton>
              <FloatingActionButton secondary>
                <ContentAdd />
              </FloatingActionButton>
            </IconButton>
          }
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          targetOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem primaryText="網路切片管理" onClick={() => showSliceManager()} />
          <MenuItem primaryText="切片裝置管理" onClick={() => showSliceDeviceManager() } />
          <Divider />
          <MenuItem
            primaryText="網路流量監控"
            rightIcon={<ArrowDropLeft />}
            menuItems={childButtons}
          />
          <Divider />
          <MenuItem
            primaryText="shortcuts"
            leftIcon={<Keyboard />}
            onClick={() => togglePanel('shortcuts')}
          />
        </IconMenu>
      </div>
    );
  }
);


ModuleButton.propTypes = {
  hidden: PropTypes.array.isRequired,
  togglePanel: PropTypes.func.isRequired,
};

export default ModuleButton;
