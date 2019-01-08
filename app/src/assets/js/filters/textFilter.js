/*
* 系统公用文本过滤器
* 创建于 2019/01/04
* */

// 文本按规定字数显示，鼠标悬浮显示全部
let textOmit = (value, num) => {
  if (!value) return
  if (value.length > num) {
    return value.substring(0, num) + '...'
  }
  return value
}
export {textOmit}
