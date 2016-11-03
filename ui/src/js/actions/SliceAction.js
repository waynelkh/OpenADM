import { createAction } from 'redux-actions';
import fetch from 'isomorphic-fetch';
import { toastr } from 'react-redux-toastr';

const updateSliceSuccess = createAction('UPDATE_SLICE');
const deleteSliceSuccess = createAction('DELETE_SLICE');

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
 * Add a slice in ui
 */
export const addSlice = createAction('ADD_SLICE');
// String uuid
export const cancelSlice = createAction('CANCEL_SLICE');
export const modifySlice = createAction('MODIFY_SLICE');

export const updateSlice = payload => (dispatch, getState) => {
  const key = Object.keys(payload)[0];
  if (payload[key].modify === false) {
    const send = {
      input: {
        'slice-id': payload[key].name,
        'slice-bandwidth': payload[key].bandwidth,
      },
    };
    hocFetch(
      `${getState().setting.controllerURL}/restconf/operations/datastore:add-slice-entry`,
      'POST',
      send
    ).then((data) => {
      toastr.info(`Update Slice ${payload}!`, data);
      console.info('updateSliceSuccess', payload, data);
      dispatch(updateSliceSuccess(payload));
    }).catch(err => toastr.error(`Update Slice ${err}`));
  }
  dispatch(updateSliceSuccess(payload));
};

export const delSlice = payload => (dispatch, getState) =>
  hocFetch(
    `${getState().setting.controllerURL}/restconf/operations/datastore:delete-slice-entry-by-name`,
    'POST',
    {
      input: {
        'slice-id': payload.name,
      },
    }
  ).then(data => {
    toastr.info(`Delete Slice ${payload.name}!`, data);
    console.info('deleteSliceSuccess', payload, data);
    dispatch(deleteSliceSuccess(payload));
  }).catch(err => toastr.error(`Delete Slice ${err}`));
