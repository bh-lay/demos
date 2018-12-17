const axios = require('axios');
import cookie from './commons/js/utils/cookie';

let csrftoken = cookie.get('csrftoken');

axios.interceptors.request.use((config) => {
  config.headers.ajaxMark = 'axios';
  if (config.method === 'post') {
    config.headers["X-CSRFToken"] = csrftoken;
  }
  return config;
});

axios.interceptors.response.use(
  (response) => {
    let resJson = response.data;
    //判断后端数据时否是一个html文件
    let isXML = /^\W*<.*/i;
    if (isXML.test(resJson)) {
      return {
        error_code: 500,
        msg: '服务器内部错误'
      }
    }
    else if (
      /*typeof resJson.data === 'object'*/
      /* &&resJson.msg !== undefined &&*/
      resJson.error_code !== undefined
      /* && resJson.data !== undefined*/
    ) {
      return resJson;
    }
    //!!!danger:开发时使用，生产环境使用有被黄鹏打死的风险
    // else{
    //   return {
    //     error_code:-1,
    //     msg:'找黄鹏问问为啥返回的数据不正确'
    //   }
    // }
    else{
      return {
        error_code: -2,
        msg: '数据格式不正确，服务出错了'
      }
    }

  },
  (err) => {
    if (err && err.response) {
      err.msg = 'HTTP';
      switch (err.response.status) {
        case 400:
          err.msg += '请求错误';
          break

        case 401:
          err.msg += '未授权，请登录'
          break

        case 403:
          err.msg += '拒绝访问'
          break

        case 404:
          err.msg += `请求地址出错: ${err.response.config.url}`
          break

        case 408:
          err.msg += '请求超时'
          break

        case 500:
          err.msg += '服务器内部错误'
          break

        case 501:
          err.msg += '服务未实现'
          break

        case 502:
          err.msg += '网关错误'
          break

        case 503:
          err.msg += '服务不可用'
          break

        case 504:
          err.msg += '网关超时'
          break

        case 505:
          err.msg += '版本不受支持'
          break

        default:
      }

      err.error_code = err.response.status;
    }

    return Promise.reject(err)
  });

export default axios;