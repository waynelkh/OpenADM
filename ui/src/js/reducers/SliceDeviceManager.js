import { handleActions } from 'redux-actions';
import Immutable from 'seamless-immutable';

const initialState = Immutable.from([]);

export default handleActions({
  ADD_SLICE_DEVICE: (state, { payload }) => {
    fetch('http://127.0.0.1:8181/restconf/operations/datastore:add-host-entry', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Basic YWRtaW46YWRtaW4=',
      },
      body: JSON.stringify({
        input:{
          "slice-id": payload.sliceId,
          "host-mac": payload.mac,
        }
      })
    }).then(data => console.log('Response: ', data));

    return Immutable.from(payload)
  },
  DEL_SLICE_DEVICE: (state, { payload }) => Immutable.from(payload),
  UPDATE_SLICE_DEVICE: (state, { payload }) => {
    Immutable.from(payload)
  },
  GET_ALL_SLICE_DEVICE: (state) => {
    fetch('http://127.0.0.1:8181/restconf/operations/datastore:add-slice-entry', {
      mode: 'cors',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Basic YWRtaW46YWRtaW4=',
      }
    }).then(data => console.log('Response: ', data));

    return Immutable.from(state)
  },

}, initialState);
