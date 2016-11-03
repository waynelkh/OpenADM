import React, { Component, PropTypes } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { onlyUpdateForKeys } from 'recompose';
import Module from '../components/Module/Module.jsx';
import ModuleButton from '../components/Module/ModuleButton.jsx';
import ShortcutsPannel from '../components/ShortcutsPannel.jsx';
import SliceDeviceManager from '../components/SliceDeviceManager.jsx';
import SliceManager from '../components/SliceManager.jsx';
import TopologyContainer from './TopologyContainer';

import FlowtableContainer from './FlowtableContainer';
import ControllerContainer from './ControllerContainer';
import SettingContainer from './SettingContainer';
import PortStatusContainer from './PortStatusContainer';
import DetailContainer from './DetailContainer';
import * as LayoutAction from '../actions/LayoutAction';
import '../components/Module/module.css';

class DomainContainer extends Component {
  renderFlowtable(props) {
    return <FlowtableContainer {...props} />;
  }
  renderControllerStatus(props) {
    return <ControllerContainer {...props} />;
  }
  renderPortStatus(props) {
    return <PortStatusContainer {...props} />;
  }
  renderSettingController(props) {
    return <SettingContainer {...props} />;
  }
  renderDetail(props) {
    return <DetailContainer {...props} />;
  }
  renderComponent(props) {
    return this[`render${props.name}`](props);
  }

  render() {
    const {
      hidden,
      layout,
      changePosition,
      changeSize,
      maximizeWindow,
      toggleModule,
      closeShortcuts,
      changezIndex,
      toggleSliceDeviceManager,
      toggleSliceManager,
      showSliceDeviceManager,
      resetLayout,
    } = this.props;
    return (
      <div>
        <ReactCSSTransitionGroup
          transitionName="moduleWrap"
          transitionEnterTimeout={500}
          transitionLeaveTimeout={300}
        >
          {layout.map((d, i) => (hidden.indexOf(d.name) === -1) ?
            <Module
              {...d}
              key={`m-${i}`}
              changePosition={changePosition}
              changeSize={changeSize}
              maximizeWindow={maximizeWindow}
              minimumWindow={toggleModule}
              changezIndex={changezIndex}
            >{this.renderComponent(d)}</Module> : null
          )}
        </ReactCSSTransitionGroup>
        <ShortcutsPannel hidden={hidden} closeShortcuts={closeShortcuts} />
        <SliceDeviceManager hidden={hidden} toggleSliceDeviceManager={toggleSliceDeviceManager} />
        <SliceManager hidden={hidden} toggleSliceManager={toggleSliceManager} />
        <ModuleButton hidden={hidden} togglePanel={toggleModule} showSliceDeviceManager={showSliceDeviceManager} />

        <TopologyContainer />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  hidden: state.layout.hidden,
  layout: state.layout.layout,
});

const mapDispatchToProps = (dispatch) => bindActionCreators(LayoutAction, dispatch);

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  onlyUpdateForKeys(['hidden', 'layout'])
);

DomainContainer.propTypes = {
  hidden: PropTypes.array.isRequired,
  layout: PropTypes.array.isRequired,
  changePosition: PropTypes.func.isRequired,
  changeSize: PropTypes.func.isRequired,
  maximizeWindow: PropTypes.func.isRequired,
  toggleModule: PropTypes.func.isRequired,
  closeShortcuts: PropTypes.func.isRequired,
  changezIndex: PropTypes.func.isRequired,
  resetLayout: PropTypes.func.isRequired,
};

export default enhance(DomainContainer);
