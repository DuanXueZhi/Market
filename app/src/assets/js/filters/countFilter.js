/*
* 系统公用计算过滤器
* 创建于 2019/01/04
* */
import jsfn from '../jsfn' // 全局引入公用函数

let countDateChinese = value => {
  var date = new Date(value)
  var time = date.getTime() // 原来时间转换为时间戳
  var diff = jsfn.localTime() - time // 计算与当前时间差
  var days = parseInt(diff / (24 * 60 * 60 * 1000))
  var leave1 = diff % (24 * 60 * 60 * 1000)
  var hours = parseInt(leave1 / (60 * 60 * 1000))
  var leave2 = leave1 % (60 * 60 * 1000)
  var minutes = parseInt(leave2 / (60 * 1000))
  var leave3 = leave2 % (60 * 1000)
  var sconds = parseInt(leave3 / (1000))
  var diffValue // 返回的汉语时间差
  if (days === 0) {
    diffValue = hours + '小时' + minutes + '分钟' + sconds + '秒前'
    if (hours === 0) {
      diffValue = minutes + '分钟' + sconds + '秒前'
      if (minutes === 0) {
        diffValue = sconds + '秒前'
      }
    }
  } else {
    diffValue = days + '天' + hours + '小时' + minutes + '分钟' + sconds + '秒前'
  }
  return diffValue
}
export {countDateChinese}
