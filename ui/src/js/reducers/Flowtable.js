import { handleActions } from 'redux-actions';
import Immutable from 'seamless-immutable';

const initialState = Immutable.from({
  flowlist: [],
  selectedFlow: {},
  selectedSwitch: [],
  selectedController: '',
  showSearch: false,
  filters: [],
  showSetting: false,
  showColumn: ['controller', 'dpid', 'actions'],
  showAction: false,
});

export default handleActions({
  FLOW_RESP: (state, { payload }) => {
    const filterRule = { controller: '', dpid: '' };
    const display = payload.filter(d => {
      for (let key in filterRule) {
        if (filterRule[key] !== '' && d[key] !== filterRule[key]) {
          return false
        }
      }
      return true;
    })
    .map(d => d.flows.map(
      (flow) => ({
        ...flow,
        actions: flow.actions
          .map(d => (d.value) ? `${d.type}=${d.value}` :  d.type )
          .reduce((pre, cur) => `${pre},${cur}`, ''),
        controller: d.controller,
        dpid: d.dpid,
      })
    )).reduce((pre, cur) => pre.concat(cur), [])
    .map((d, i) => ({ ...d, flowId: i }));
    return state.set('flowlist', display);
  },
  SELECT_CONTROLLER: (state, { payload }) => state
    .set('selectedController', payload),
  SELECT_SWITCH: (state, { payload }) => state
    .set('selectedSwitch', payload),
  TOGGLE_SEARCH: (state) => state
    .set('showSearch', !state.showSearch),
  TOGGLE_SETTING: (state) => state
    .set('showSetting', !state.showSetting),
  TOGGLE_ACTION: (state) => state
    .set('showAction', !state.showAction),
  SELECT_FLOW: (state, { payload }) => state
    .set('selectedFlow', payload),
  ADD_FILTER: (state, { payload }) => state
    .update('filters', f => f.concat(payload)),
  DELETE_FILTER: (state, { payload }) => state
    .update('filters', f => f.filter(d => d !== payload)),
  SHOW_COLUMN_SETTING: (state, { payload }) => state
    .set('showColumn',
      (payload.checked) ?
      state.showColumn.concat(payload.value) :
      state.showColumn.filter(d => d !== payload.value)
    ),
  TOGGLE_VISIBLE_FIELD: (state, { payload }) => state
    .update('visibleField', arr => {
      const index = arr.indexOf(payload);
      if (index !== -1) {
        return [
          ...arr.slice(0, index),
          ...arr.slice(index + 1),
        ];
      }
      return arr.concat(payload);
    }),
  FETCH_TABLE: (state, action) => state
    .update('flowlist', () => action.payload),
  'FLOW/TOP_RESP': (state, action) => state
    .update('flowlist', () => action.payload),
  FLOWTABLE_CLICK: (state, { payload }) => state
    .update('selectFlow', () => payload),
  SIMULATE_RESP: (state) => state
    .set('selectFlow', {}),
  SELECT_NODE: (state, { payload }) => {
    if (!payload.dpid) {
      return state;
    }
    const filter = {
      category: 'dpid',
      operator: '==',
      value: payload.dpid,
    };
    const inFilter = state.filters
      .findIndex(f => f.category === 'dpid' && f.value === payload.dpid);
    if (inFilter === -1) {
      return state.update('filters', f => f.concat(filter));
    }
    return state.update('filters',
      f => f.filter(d => d.category !== 'dpid' && d.value !== payload.dpid)
    );
  },
}, initialState);
