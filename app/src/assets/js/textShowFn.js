/*
* 系统公用文本展示页面
* 创建于 2019/01/06
* */
import commonIndex from '../../components/common/commonIndex'

var FullDisplayText = commonIndex.fullDisplayText

const textFull = function ( // 参数说明：要绑定的父元素的id，展示文本，展示位置
  fatherLabel,
  fullText,
  showPosition,
  abc
) {
  console.log(abc)
  var label = fatherLabel || 'body' // 利用短路现象进行空值转换
  var fullDisplayTextComponent = new FullDisplayText({
    data: {
      fullText: fullText,
      showPosition: showPosition
    }
  }).$mount()
  document.querySelector(label).appendChild(fullDisplayTextComponent.$el)
}

export default {textFull}
