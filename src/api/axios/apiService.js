import axios from 'axios';

export const makeApiCall = async props => {
  const {method, url, data, headers = {}, params, ignoreError} = props;

  const baseURL = 'https://dummyjson.com/';

  let header = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Authorization: null,
    ...headers,
  };

  return new Promise((resolve, reject) => {
    const options = {
      method: method,
      url: baseURL + url,
      headers: header,
      params: params,
    };
    if (Object.keys(data)?.length != 0) {
      options.data = data;
    }

    axios(options)
      .then(response => {
        if (response.status === 200 || response.status === 201) {
          resolve(response.data);
        } else {
          reject(response?.data);
        }
      })
      .catch(error => {
        if (ignoreError) {
          reject();
        } else {
          reject(error?.response?.data);
        }

        if (axios.isCancel(error)) {
        } else {
        }
      });
  });
};
