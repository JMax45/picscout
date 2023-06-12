// Created a wrapper to be able to use Jest's
// mock functions to facilitate testing

import axios, { AxiosPromise } from 'axios';

const axiosGet = (...args: Parameters<typeof axios.get>): AxiosPromise<any> => {
  return axios.get(...args);
};

export default axiosGet;
