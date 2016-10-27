import { handleActions } from 'redux-actions';
import Immutable from 'seamless-immutable';

const initialState = Immutable.from([]);

export default handleActions({
  ADD_SLICE_DEVICE: (state, { payload }) => Immutable.from(payload),
  DEL_SLICE_DEVICE: (state, { payload }) => Immutable.from(payload),
  UPDATE_SLICE_DEVICE: (state, { payload }) => Immutable.from(payload),

}, initialState);
