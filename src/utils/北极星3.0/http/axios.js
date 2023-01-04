/**
 * axios实例
 */
import axios from "axios";
import config from '@/api/config';

export const Axios = axios.create({
  baseURL: config.baseURL,
  responseType: 'json',
  // withCredentials: false,
  timeout: 150000,
  headers: {
    'Content-Type': 'application/json;charset=utf-8',
    'Accept': 'application/json'
  }
});