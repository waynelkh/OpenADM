import { handleActions } from 'redux-actions';
import Immutable from 'seamless-immutable';
import uuid from 'node-uuid';

const initialState = Immutable.from({});

export default handleActions({
  ADD_SLICE: state => state.merge({ [uuid.v1()]: { name: 'name', bandwidth: 'M', modify: true } }),
  DEL_SLICE: (state, { payload }) => state.without(payload),
  UPDATE_SLICE: (state, { payload }) => state.merge(payload),
}, initialState);
