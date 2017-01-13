import { createAction } from 'redux-actions';
import fetch from 'isomorphic-fetch';
import { toastr } from 'react-redux-toastr';

const updateSliceSuccess = createAction('UPDATE_SLICE');
const deleteSliceSuccess = createAction('DELETE_SLICE');
const getSliceSuccess = createAction('GET_SLICE');

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
  const send = {
    input: {
      'slice-name': payload[key].name,
      'slice-bandwidth': payload[key].bandwidth,
    },
  };
  hocFetch(
    `${getState().setting.controllerURL}/restconf/operations/infomanager:add-slice-entry`,
    'POST',
    send
  ).then((data) => {
    toastr.info(`Update Slice ${payload}!`, data);
    console.info('updateSliceSuccess', payload, data);
    dispatch(updateSliceSuccess(payload));
  }).catch(err => toastr.error(`Update Slice ${err}`));
};

export const delSlice = payload => (dispatch, getState) =>
  hocFetch(
    `${getState().setting.controllerURL}/restconf/operations/infomanager:delete-slice-entry-by-name`,
    'POST',
    {
      input: {
        'slice-name': payload.name,
      },
    }
  ).then(data => {
    toastr.info(`Delete Slice ${payload.name}!`, data);
    console.info('deleteSliceSuccess', payload, data);
    dispatch(deleteSliceSuccess(payload));
  }).catch(err => toastr.error(`Delete Slice ${err}`));

export const getSlice = () => (dispatch, getState) =>
  fetch(`${getState().setting.controllerURL}/restconf/config/infomanager:slice-table`, {
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
  })
  .then(res => res.json())
  .then(data => {
    const payload = data['slice-table']['slice-entries'];

    dispatch(getSliceSuccess(payload));
  });
