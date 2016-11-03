import { handleActions } from 'redux-actions';
import Immutable from 'seamless-immutable';
import uuid from 'node-uuid';

const initialState = Immutable.from({});

export default handleActions({
  ADD_SLICE: state => state.merge({ [uuid.v1()]: { name: 'name', bandwidth: 'M', modify: true } }),
  MODIFY_SLICE: (state, { payload }) => state.update(payload,
    slice => ({ ...slice, modify: true })
  ),
  CANCEL_SLICE: (state, { payload }) => state.update(payload,
    slice => ({ ...slice, modify: false })
  ),
  DELETE_SLICE: (state, { payload }) => state.without(payload.uuid),
  UPDATE_SLICE: (state, { payload }) => state.merge(payload),
}, initialState);
