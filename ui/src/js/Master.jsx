/**
 * Master Component
 * the root component
 */
import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import ReduxToastr from 'react-redux-toastr';
import 'react-redux-toastr/lib/css/react-redux-toastr.min.css';
import LeftNavBar from './components/LeftNavBar.jsx';
import AppBar from 'material-ui/AppBar';
import AppCanvas from 'material-ui/internal/AppCanvas';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import Theme from '../theme.js';
import { resetLayout } from './actions/LayoutAction';
import * as CoreAction from './actions/CoreAction';
import SyncIcon from 'material-ui/svg-icons/notification/sync';
import RestoreIcon from 'material-ui/svg-icons/action/restore';
import RemoveIcon from 'material-ui/svg-icons/content/remove-circle';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';

const styles = {
  paddingTop: '64px',
  paddingRight: '0px',
  paddingBottom: '0px',
  paddingLeft: '0px',
  height: '92vh',
};

class Master extends React.Component {

  constructor(props) {
    super(props);
    this.onLeftIconButtonTouchTap = this.onLeftIconButtonTouchTap.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.handleSubscribe = this.handleSubscribe.bind(this);
    this.handleClearPath = this.handleClearPath.bind(this);
    this.handleRestoreCore = this.handleRestoreCore.bind(this);
  }

  getChildContext() {
    return {
      muiTheme: getMuiTheme(Theme),
    };
  }

  onLeftIconButtonTouchTap() {
    this.refs.leftNav.handleToggle();
  }

  handleReset() {
    this.props.resetLayout();
  }

  handleSubscribe() {
    this.props.subscribe();
  }

  handleClearPath() {
    this.props.clearAllPath();
  }

  handleRestoreCore() {
    this.props.restoreCore();
  }

  render() {
    return (
      <AppCanvas>
        <AppBar
          title="ITRI Mobile Backhaul"
          iconElementRight={
            <IconMenu
              iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
              targetOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
            >
              <MenuItem
                leftIcon={<RestoreIcon />}
                primaryText="Reset layout"
                onClick={this.handleReset}
              />
              <MenuItem
                leftIcon={<SyncIcon />}
                primaryText="Sync data"
                onClick={this.handleSubscribe}
              />
              <MenuItem
                leftIcon={<RemoveIcon />}
                primaryText="Clear Path"
                onClick={this.handleClearPath}
              />
              <MenuItem
                leftIcon={<RemoveIcon />}
                primaryText="Restore core"
                onClick={this.handleRestoreCore}
              />
            </IconMenu>
          }
          onLeftIconButtonTouchTap={this.onLeftIconButtonTouchTap}
        />
        <LeftNavBar ref="leftNav" />
        <ReduxToastr
          timeOut={4000}
          newestOnTop={false}
          position="top-right"
        />
        <div style={styles}>
          {this.props.children}
        </div>
      </AppCanvas>
      );
  }
}

Master.propTypes = {
  children: PropTypes.object.isRequired,
  resetLayout: PropTypes.func.isRequired,
  subscribe: PropTypes.func.isRequired,
  clearAllPath: PropTypes.func.isRequired,
  restoreCore: PropTypes.func.isRequired,
};

Master.childContextTypes = {
  muiTheme: PropTypes.object,
};

const mapDispatchToProps = (dispatch) => bindActionCreators({
  resetLayout,
  ...CoreAction,
}, dispatch);

export default connect(null, mapDispatchToProps)(Master);
