const config = {
  /** 正式环境 */
  // baseURL: 'https://supplier.api.aukeys.com/api/v1/admin/'

  /** 测试环境 */
  baseURL: 'http://supplier.api.test.aukeys.com/api/v1/admin/'

  /** 张利 **/
   //baseURL: 'http://www.supplier.com/api/v1/admin/'

}
/* eslint-disable */
if (process.env.NODE_ENV === 'production') {
  config.baseURL = window.location.host === 'supplier.aukeys.com' ? 'https://supplier.api.aukeys.com/api/v1/admin/' : 'http://supplier.api.test.aukeys.com/api/v1/admin/';
}
/* eslint-disable */
export default config;
