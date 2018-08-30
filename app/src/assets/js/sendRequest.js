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
  axios.post(UrlHead + Url, {data: data}).then(res => {
    return res
  })
}
// get请求函数
const RTSGet = (Url, data) => {
  axios.get(UrlHead + Url, {data: data}).then(res => {
    return res
  })
}
// 上传图片请求函数
const RTSuploadImage = (Url, data) => {

}

// 导出所有函数
export default {RTSPost, RTSGet, RTSuploadImage}
