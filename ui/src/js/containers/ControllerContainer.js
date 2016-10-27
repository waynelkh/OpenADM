import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Tabs, Tab } from 'material-ui/Tabs';
import InfoIcon from 'material-ui/svg-icons/action/info';
import { List, ListItem } from 'material-ui/List';

const TabContent = ({ cs }) =>
  <List>
    {Object.keys(cs).map((key, i) =>
      <ListItem key={`key-${i}`} primaryText={`${key}: ${cs[key]}`} />
    )}
  </List>;

TabContent.propTypes = {
  cs: PropTypes.object,
};

const ControllerContainer = ({ controllerStatus }) => {
  const alltab = controllerStatus.map(d => (
    <Tab
      key={`key-${d.controller}`}
      icon={<InfoIcon />}
      label={d.controller}
    >
      <TabContent cs={d} />
    </Tab>
  ));
  return (
    <div>
      <Tabs>{alltab}</Tabs>
      {(controllerStatus.length) > 0 ? '' : <h1>Controller</h1>}
    </div>
  );
};

ControllerContainer.propTypes = {
  controllerStatus: PropTypes.array.isRequired,
};

const mapStateToProps = (state) => ({
  controllerStatus: state.controllerStatus,
});

export default connect(mapStateToProps)(ControllerContainer);
