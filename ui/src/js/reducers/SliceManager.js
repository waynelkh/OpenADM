import { handleActions } from 'redux-actions';
import Immutable from 'seamless-immutable';
import uuid from 'node-uuid';
import fetch from 'isomorphic-fetch';

const initialState = Immutable.from({});

export default handleActions({
  ADD_SLICE: state => state.merge({ [uuid.v1()]: { name: 'name', bandwidth: 'M', modify: true } }),
  DEL_SLICE: (state, { payload }) => {
    fetch('http://127.0.0.1:8181/restconf/operations/datastore:delete-slice-entry-by-id', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Basic YWRtaW46YWRtaW4=',
      },
      body: JSON.stringify({
        input: {
          'slice-id': payload.name,
        },
      }),
    }).then(data => console.log('Response: ', data));

    return state.without(payload);
  },
  UPDATE_SLICE: (state, { payload }) => {
    const key = Object.keys(payload)[0];
    if(payload[key].modify === false) {
      const send = {
        input: {
          "slice-id": payload[key].name,
          "slice-bandwidth": payload[key].bandwidth,
        },
      };
      fetch('http://127.0.0.1:8181/restconf/operations/datastore:add-slice-entry', {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Basic YWRtaW46YWRtaW4=',
        },
        body: JSON.stringify(send),
      }).then(data => console.log('Response: ', data));
    }
    return state.merge(payload);
  },
}, initialState);
