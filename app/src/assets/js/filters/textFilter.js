/*
* 系统公用文本过滤器
* 创建于 2019/01/04
* */

// 文本按规定字数显示并添加...，鼠标悬浮显示全部
let textOmit = (value, num) => {
  if (!value) return
  if (value.length > num) {
    return value.substring(0, num) + '...'
  }
  return value
}

// 文本按规定字数显示(文本截取)
let textCutOut = (value, num) => {
  if (!value) return
  if (value.length > num) {
    return value.substring(0, num)
  }
  return value
}

// 固定英文单词转换为汉语
let EnglishTranslate = (value) => {
  if (!value) return '空值！'
  switch (value) {
    case 'onlineBuyer':
      return '在线购买者'
    case 'boss':
      return '店长'
    case 'assistant':
      return '店员'
    case 'identity':
      return '身份'
    case 'userName':
      return '用户名'
    case 'admin':
      return '管理员'
    case 'name':
      return '商品名'
    case 'id':
      return '商品货号'
  }
}

export {textOmit, textCutOut, EnglishTranslate}
