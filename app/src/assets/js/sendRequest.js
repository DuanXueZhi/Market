/*
* 由段学智创建于2018/08/03
* 整个系统的请求函数
* */
import axios from 'axios' // 导入axios插件

/* 上线设置 */
// const UrlHead = '' // 设置请求头【开发环境使用，线上环境使用nginx转发】 http://localhost:3000

/* 开发设置 */
const UrlHead = 'http://localhost:3000' // 设置请求头【开发环境使用，线上环境使用nginx转发】 http://localhost:3000

const nginxIntercept = '.DXZ' // 设置nginx拦截参数
/*
* 请求函数
* */
// post请求函数
const RTSPost = (Url, data) => {
  return axios.post(UrlHead + Url + nginxIntercept + '?time=' + Date.now(), {data: data}).catch(err => {
    console.log('post请求函数，后台错误！', err)
  })
}
// get请求函数
const RTSGet = (Url, data) => {
  return axios.get(UrlHead + Url + nginxIntercept + '?time=' + Date.now(), {params: data}).catch(err => {
    console.log('get请求函数，后台错误！', err)
  })
}
// delete请求函数
const RTSDelete = (Url, data) => {
  return axios.delete(UrlHead + Url + nginxIntercept + '?time=' + Date.now(), {params: data}).catch(err => {
    console.log('delete请求函数，后台错误！', err)
  })
}

// 导出所有函数
export default {RTSPost, RTSGet, RTSDelete}
