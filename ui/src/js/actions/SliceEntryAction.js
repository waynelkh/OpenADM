import { createAction } from 'redux-actions';
import fetch from 'isomorphic-fetch';
import { toastr } from 'react-redux-toastr';

const getSliceEntrySuccess = createAction('GET_SLICE_DEVICE');

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
  body: JSON.stringify(payload),
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
  console.log('updateDevice', payload);
  const send = {
    input: {
      'slice-name': payload.slice,
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

export const getAllSliceEntry = payload => (dispatch, getState) => {
  Promise.all([
    fetch(`${getState().setting.controllerURL}/restconf/config/datastore:slice-table`, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Basic YWRtaW46YWRtaW4=',
      },
    }).then((response) => {
      if (response.status >= 400) {
        throw new Error(response.statusText);
      }
      return response;
    }).then(res => res.json()),
    fetch(`${getState().setting.controllerURL}/restconf/config/datastore:host-table`, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Basic YWRtaW46YWRtaW4=',
      },
    }).then((response) => {
      if (response.status >= 400) {
        throw new Error(response.statusText);
      }
      return response;
    }).then(res => res.json()),
  ]).then((result) => {
    const slices = result[0]['slice-table']['slice-entries'].map(s => s['slice-name']);
    const hosts = result[1]['host-table']['host-entries'];
    dispatch(getSliceEntrySuccess({ slices, hosts }));
  });
};
