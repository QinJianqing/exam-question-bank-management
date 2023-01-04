/**
 * http动作
 * */
import { Axios } from './interceptors';
import store from '@/store';

/* eslint-disable */
const urlFilter = (url) => {
  return true;
  const { requestApi } = store.state.home;
  // console.log("url............", requestApi, url.replace(/\/\d+/g, "/*").split('?')[0], requestApi.indexOf(url.replace(/\/\d+/g, "/*").split('?')[0]) >= 0);
  return requestApi.indexOf('*') >= 0 || requestApi.indexOf(url.replace(/\/\d+/g, "/*").split('?')[0]) >= 0;
};
/**
 * get方法，对应get请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 * @returns {Promise} 返回承诺
 */
export const get = (url, params) => {
  return urlFilter(url) ?
    Axios.get(url, { params }) :
    Promise.resolve({
      code: 303,
      // message: `【${url}】没有权限`,
      message: `数据没有请求权限`,
      data: []
    });
};

/**
 * get方法，对应get请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 * @returns {Promise} 返回承诺
 */
export const getExport = (url, params) => {
  return urlFilter(url) ?
    Axios.get(url, { params }) :
    Promise.resolve({
      code: 303,
      message: `数据没有请求权限`,
      data: []
    });
};

/**
 * post方法，对应post请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 * @param {Object} header [请求时携带的参数]
 * @returns {Promise} 返回承诺
 */
export const post = (url, params, header = {}) => {
  return urlFilter(url) ?
    Axios.post(url, params, header) :
    Promise.resolve({
      code: 303,
      message: `数据没有请求权限`,
      data: []
    });
};

/**
 * delete方法，对应delete请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 * @returns {Promise} 返回承诺
 */
export const Delete = (url, params) => {
  return urlFilter(url) ?
    Axios.delete(url, { params }) :
    Promise.resolve({
      code: 303,
      message: `数据没有请求权限`,
      data: []
    });
};

/**
 * put方法，对应put请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 * @returns {Promise} 返回承诺
 */
export const put = (url, params) => {
  return urlFilter(url) ?
    Axios.put(url, params) :
    Promise.resolve({
      code: 303,
      message: `数据没有请求权限`,
      data: []
    });
};