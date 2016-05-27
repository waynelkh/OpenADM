import React from 'react';
import { render } from 'react-dom';
import { syncHistoryWithStore } from 'react-router-redux';
import { browserHistory } from 'react-router';
import Immutable from 'seamless-immutable';
import configureStore from './js/stores/configureStore';
import { ioInit } from './js/middlewares/socket';
import Root from './js/Root.js';

import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

const initialState = Immutable({
  counter: { count: 0, name: 'default' },
  routing: { locationBeforeTransitions: null },
  layout: {
    gridLayout: [
      { i: 'Flowtable', x: 1, y: 0, w: 3, h: 3 },
      { i: 'ControllerStatus', x: 4, y: 0, w: 3, h: 3 },
      { i: 'PortStatus', x: 4, y: 0, w: 3, h: 3 },
    ],
    hiddenPanel: [],
    maximumPanel: '',
  },
  setting: {},
  topology: {
    filterType: [
      { type: 'type', filter: 'switch' },
      { type: 'id', filter: '00:0a:00:00:00:51:85:91' },
    ],
    selectNodes: [],
    level: 0,
    nodes: [],
    links: [],
  },
  controllerStatus: {},
  flowtable: {
    filterString: '',
    visibleField: ['ipv4'],
  },
});

const store = configureStore(initialState, browserHistory);
// ioInit(store);
const history = syncHistoryWithStore(
  browserHistory,
  store,
  { selectLocationState: state => state.routing }
);

if (typeof(document) !== 'undefined' && window) {
  window.onload = () => render(
    <Root store={store} history={history} />,
    document.getElementById('app')
  );
}

export default store;
