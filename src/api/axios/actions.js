import {makeApiCall} from './apiService';

const GET = 'GET';
const POST = 'POST';
const PATCH = 'PATCH';
const PUT = 'PUT';
const DELETE = 'DELETE';

export const getProductsData = async request => {
  return makeApiCall({
    method: GET,
    url: 'products',
    params: request?.params,
    data: request?.data,
  })
    .then(response => {
      if (request.onSuccess) request.onSuccess(response);
    })
    .catch(error => {
      if (request.onFail) request.onFail(error);
    });
};

export const postProductsData = async request => {
  return makeApiCall({
    method: POST,
    url: 'products/add',
    params: request?.params,
    data: request?.data,
  })
    .then(response => {
      if (request.onSuccess) request.onSuccess(response);
    })
    .catch(error => {
      if (request.onFail) request.onFail(error);
    });
};

export const patchProductsData = async request => {
  return makeApiCall({
    method: PATCH,
    url: `products/${request?.params?.id}`,
    data: request?.data,
  })
    .then(response => {
      if (request.onSuccess) request.onSuccess(response);
    })
    .catch(error => {
      if (request.onFail) request.onFail(error);
    });
};

export const putProductsData = async request => {
  return makeApiCall({
    method: PUT,
    url: `products/${request?.params?.id}`,
    data: request?.data,
  })
    .then(response => {
      if (request.onSuccess) request.onSuccess(response);
    })
    .catch(error => {
      if (request.onFail) request.onFail(error);
    });
};

export const deleteProductsData = async request => {
  return makeApiCall({
    method: DELETE,
    url: `products/${request?.params?.id}`,
  })
    .then(response => {
      if (request.onSuccess) request.onSuccess(response);
    })
    .catch(error => {
      if (request.onFail) request.onFail(error);
    });
};
