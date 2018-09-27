/*
* 系统公用弹窗函数
* 创建于 2018/08/13
* */
import Vue from 'vue'
import commonIndex from '../../components/common/commonIndex'

// loading
// var NormalLoading = commonIndex.normalLoading
// window
var WarningRemindWindow = commonIndex.warningRemindWindow

var bus = new Vue()

// 系统所有弹窗函数
const allWindow = function (fatherLabel, category, content, operate) { // 参数说明：要绑定的父元素的id，弹窗类型，弹窗内容，弹窗操作（确定）
  var label = fatherLabel || 'body' // 利用短路现象进行空值转换
  if (label !== 'body') { // 判断不是body从而添加 #
    // console.log('不为 body')
    label = '#' + label
  }
  // 更新变量
  var option =
    {
      show: true,
      titleColor: '',
      titleText: category,
      contentText: content,
      operateText: operate
    }
  // 弹窗
  switch (category) { // 对弹窗类型进行判断，从而控制页面中弹窗图标的改变
    case '警告': // 警告弹窗（删除时必须使用）使用页面：['./src/components/Home/AddNewGoods.vue']
      // console.log('windowFn.js中引用警告弹窗')
      option.titleColor = 'red' // 更改传参中提示颜色
      var warningWindowComponent = new WarningRemindWindow({
        data: option
      }).$mount()
      document.querySelector(label).appendChild(warningWindowComponent.$el)
      // 返回一个回调函数需要有Promise和resolve
      return new Promise(resolve => {
        bus.$on('confirmAgree', (e) => {
          resolve(e)
        })
      })
    case '提示': // 提示弹窗（提示一下用户，调用时无需等待回调）使用页面：['./src/components/Home/AddNewGoods.vue']
      // console.log('windowFn.js中引用提示弹窗')
      option.titleColor = 'orange' // 更改传参中提示颜色
      var remindWindowComponent = new WarningRemindWindow({
        data: option
      }).$mount()
      document.querySelector(label).appendChild(remindWindowComponent.$el)
      break
    case '恭喜': //  祝贺弹窗（提示用户操作成功， 无需等待回调）使用页面：['./src/components/Home/AddNewGoods.vue']
      console.log('windowFn.js中引用恭喜弹窗')
      option.titleColor = 'green' // 更改传参中提示颜色
      var congratulateWindowComponent = new WarningRemindWindow({
        data: option
      }).$mount()
      document.querySelector(label).appendChild(congratulateWindowComponent.$el)
      break
  }
}

export default {bus, allWindow}

/*
* 笔记
* */
// 实验函数
/*
const thisTest = function (content) {
  // var div = document.createElement('div')
  // var text = document.createTextNode(content)
  // div.appendChild(text)
  // document.querySelector('body').appendChild(loadingIndex.maskingComponent.$el)
  // loadingIndex.installe();
  // 正常蒙版

  var maskingComponent = new Masking({
    data: {name: 'windowFn.js中传进去的参数'}
  }).$mount()

  document.querySelector('body').appendChild(maskingComponent.$el)

  var normalLoadingComponent = new NormalLoading().$mount()

  document.querySelector('body').appendChild(normalLoadingComponent.$el)
}
*/
