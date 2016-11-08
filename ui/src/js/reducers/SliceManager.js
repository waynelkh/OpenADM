import { handleActions } from 'redux-actions';
import Immutable from 'seamless-immutable';
import uuid from 'node-uuid';

const initialState = Immutable.from({});

export default handleActions({
  GET_SLICE: (state, { payload }) => {
    const slices = payload.map(slice => ({
      name: slice['slice-name'],
      bandwidth: slice['slice-bandwidth'],
      modify: false,
    })).reduce((pre, cur) => ({
      ...pre,
      [uuid.v1()]: { ...cur },
    }), {});
    return Immutable.from(slices);
  },
  ADD_SLICE: state => state.merge({ [uuid.v1()]: { name: '', bandwidth: '', modify: true } }),
  MODIFY_SLICE: (state, { payload }) => state.update(payload,
    slice => ({ ...slice, modify: true })
  ),
  CANCEL_SLICE: (state, { payload }) => state.update(payload,
    slice => ({ ...slice, modify: false })
  ),
  DELETE_SLICE: (state, { payload }) => state.without(payload.uuid),
  UPDATE_SLICE: (state, { payload }) => state.merge(payload),
}, initialState);
