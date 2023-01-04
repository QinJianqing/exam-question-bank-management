/**
 * axios封装
 * 请求拦截、响应拦截、统一错误处理
 */
import { Axios } from './axios';
import { message } from 'ant-design-vue';
import store from '@/store';

// 请求拦截器
Axios.interceptors.request.use(
  (config) => {
    /** 根据当前的用户来判断API限制
     return Promise.reject({code: 30999, message: `'${config.url}'请求失败, 可能没有相应的权限`, data: []});
     根据当前的用户来判断API限制 */

    const token = localStorage.getItem('POLARIS_TOKEN');
    token && (config.headers.Authorization = `Bearer ${token}`);

    if (config.method === 'post' || config.method === 'put') {
      config.data = {
        ...config.data,
        _t: Date.parse(new Date()) / 1000
      };
    } else {
      config.params = {
        ...config.params,
        _t: Date.parse(new Date()) / 1000
      };
    }
    return config;
  }, (error) => {
    if (error && error.response) {
      return Promise.error(error);
    }
    return error.message('连接服务器失败');
  }
);

// 响应拦截器
Axios.interceptors.response.use(
  (response) => {
    if (response && response.data.code === 200) {
      return response.data;
    }
    if (response && response.data.code === 30401) {
      // console.log('%c___响应拦截', 'background:black;color:white;','');
      // 跳转登录页面，并将要浏览的页面fullPath传过去，登录成功后跳转需要访问的页面 清除token
      store.dispatch('USER_LOGIN_OUT');
      message.destroy();
      message.error(response.data.message, 5);
      return Promise.reject(response);
    }
    if (response && response.data.code === 30402) {
      // 业务问题错误
      message.destroy();
      message.error(response.data.message, 5);
      return Promise.reject(response);
    }
    return Promise.reject(response);
  }, error => {
    if (error.message === 'timeout of 15000ms exceeded') {
      message.destroy();
      message.error('服务器响应超时，请刷新当前页！', 5);
    } else {
      // const text = error.message || error.toString();
      // if (text !== 'Cancel') {
      //   // 不是重复请求报错
      //   Notice.error({title: 'Service Error', desc: error.message || error.toString(), duration: 5});
      // }
    }
    return Promise.reject(error);
  });

export { Axios };