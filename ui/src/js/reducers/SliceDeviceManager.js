import { handleActions } from 'redux-actions';
import Immutable from 'seamless-immutable';
import uuid from 'node-uuid';

const initialState = Immutable.from({});

// { host-table: {
//    "host-entries": [
//     { host-mac: 'xxxxx',  'slice-id': 'slice1003'},
//    ]
//  } }
//  fetch('http://127.0.0.1:8181/restconf/config/datastore:slice-table', {
//  { slice-table: {
//      slice-entries: [
//      { slice-bandwidth: 200 },
//      { slice-id: '100' },
//      ]
//   } }
//
export default handleActions({
  ADD_DEVICE: (state, { payload }) => state.update(payload,
    slice => slice.merge({
      [uuid.v1()]: {
        mac: 'input mac',
        modify: true,
      },
    })
  ),
  DELETE_DEVICE: (state, { payload }) => state.update(payload.slice,
    slice => slice.without(payload.uuid)
  ),
  MODIFY_DEVICE: (state, { payload }) => state.update(payload.slice,
    slice => slice.update(payload.uuid,
      device => ({ ...device, modify: true })
    )
  ),
  CANCEL_DEVICE: (state, { payload }) => state.update(payload.slice,
    slice => slice.update(payload.uuid,
      device => ({ ...device, modify: false })
    )
  ),
  UPDATE_DEVICE: (state, { payload }) => state.update(payload.slice,
    slice => slice.update(payload.uuid,
      () => ({ mac: payload.mac, modify: false })
    )
  ),
  GET_SLICE_DEVICE: (state, { payload }) => {
    const { slices, hosts } = payload;
    const devices = slices.reduce((pre, cur) => {
      const inHost = hosts.filter(h => h['slice-name'] === cur);

      return {
        ...pre,
        [cur]: inHost.reduce((preHost, curHost) => ({
          ...preHost,
          [uuid.v1()]: {
            mac: curHost['host-mac'],
            sliceId: curHost['slice-name'],
            modify: false,
          }
        }), {}),
      }
    }, {});
    return Immutable.from(devices);
  },
}, initialState);
