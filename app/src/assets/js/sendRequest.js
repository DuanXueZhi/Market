/*
* 由段学智创建于2018/08/03
* 整个系统的请求函数
* */
import axios from 'axios' // 导入axios插件

const UrlHead = 'http://localhost:3000' // 设置请求头
/*
* 请求函数
* */
// post请求函数
const RTSPost = (Url, data) => {
  return axios.post(UrlHead + Url, {data: data})
}
// get请求函数
const RTSGet = (Url, data) => {
  return axios.get(UrlHead + Url, {data: data})
}

// 导出所有函数
export default {RTSPost, RTSGet}
