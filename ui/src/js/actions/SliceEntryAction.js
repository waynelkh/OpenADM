import { createAction } from 'redux-actions';
import fetch from 'isomorphic-fetch';
import { toastr } from 'react-redux-toastr';

const getAllSliceEntrySuccess = createAction('GET_ALL_SLICE_DEVICE');

const updateDeviceSuccess = createAction('UPDATE_DEVICE');
const deleteDeviceSuccess = createAction('DELETE_DEVICE');

const hocFetch = (url, method, payload) => fetch(url, {
  method,
  mode: 'cors',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Authorization': 'Basic YWRtaW46YWRtaW4=',
  },
  body: () => (method !== 'GET') ? JSON.stringify(payload) : null,
}).then((response) => {
  if (response.status >= 400) {
    throw new Error(response.statusText);
  }
  return response;
});

/**
 * Add a device in ui
 */
export const addDevice = createAction('ADD_DEVICE');
// String uuid
export const cancelDevice = createAction('CANCEL_DEVICE');
export const modifyDevice = createAction('MODIFY_DEVICE');

export const updateDevice = payload => (dispatch, getState) => {
  const send = {
    input: {
      'slice-id': payload.slice,
      'host-mac': payload.mac,
    },
  };
  hocFetch(
    `${getState().setting.controllerURL}/restconf/operations/datastore:add-host-entry`,
    'POST',
    send
  ).then((data) => {
    toastr.info(`Update Device ${payload}!`, data);
    dispatch(updateDeviceSuccess(payload));
  }).catch(err => {
    toastr.error(`Update Device ${err}`)
    dispatch(updateDeviceSuccess(payload));
  });
};

export const delDevice = payload => (dispatch, getState) =>
  hocFetch(
    `${getState().setting.controllerURL}/restconf/operations/datastore:delete-host-entry-by-mac`,
    'POST',
    {
      input: {
        'slice-id': payload.slice,
        'host-mac': payload.mac,
      },
    }
  ).then(data => {
    toastr.info(`Delete Device ${payload}!`, data);
    dispatch(deleteDeviceSuccess(payload));
  }).catch(err => {
    toastr.error(`Delete Device ${err}`)
    dispatch(deleteDeviceSuccess(payload));
  });


const mockdata = [
  {
    'slice-table': {
      'slice-entries': [
        { 'slice-bandwidth': 200, 'slice-id': 'slice1001' },
        { 'slice-bandwidth': 400, 'slice-id': 'slice1002' },
        { 'slice-bandwidth': 500, 'slice-id': 'slice1003' },
      ],
    },
  },
  {
    'host-table': {
      'host-entries': [
        { 'host-mac': 'xxxxx', 'slice-id': 'slice1003' },
        { 'host-mac': 'xxxxa', 'slice-id': 'slice1001' },
        { 'host-mac': 'axxxd', 'slice-id': 'slice1001' },
        { 'host-mac': 'xxxxc', 'slice-id': 'slice1002' },
      ],
    },
  },
];

export const getAllSliceEntry = payload => (dispatch, getState) => {
  // const slices = mockdata[0]['slice-table']['slice-entries'].map(s => s['slice-id']);
  // const hosts = mockdata[1]['host-table']['host-entries'];
  // dispatch(getAllSliceEntrySuccess({ slices, hosts }));
  Promise.all([
    hocFetch(
      `${getState().setting.controllerURL}/restconf/config/datastore:slice-table`,
      'GET',
      {}
    ),
    hocFetch(
      `${getState().setting.controllerURL}/restconf/config/datastore:host-table`,
      'GET',
      {}
    ),
  ]).then((result) => {
    try {
      const slices = result[0]['slice-table']['slice-entries'].map(s => s['slice-id']);
      const hosts = result[1]['host-table']['host-entries'];
      dispatch(getAllSliceEntrySuccess({ slices, hosts }));
    } catch (e) {

    } finally {

    }
  });

  /**
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
   */
};
