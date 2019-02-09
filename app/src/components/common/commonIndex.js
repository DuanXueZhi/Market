/*
* 该文件夹下所有loading、window、showImage、textShow的入口文件，导出所有Vue.extend构造后的值
* 创建于 2018/08/14
* */
import Vue from 'vue'
// loading文件
import normalLoadingVue from './loading/NormalLoading' // 正常加载（加载中...）
// window文件
import warningRemindWindowVue from './window/WarningRemindWindow' // 警告弹窗
import loginWindowVue from './window/LoginWindow' // 用户登录弹窗
// 文本展示组件
import fullDisplayTextVue from './textShow/FullDisplayText' // 文本展示组件（未用到）
// 大图展示组件
import showBigImageVue from './showImage/ShowBigImage'

const normalLoading = Vue.extend(normalLoadingVue) // 将vue文件作为构造器的参数
const warningRemindWindow = Vue.extend(warningRemindWindowVue)
const loginWindow = Vue.extend(loginWindowVue)
const fullDisplayText = Vue.extend(fullDisplayTextVue)
const showBigImage = Vue.extend(showBigImageVue)

export default {normalLoading, warningRemindWindow, loginWindow, fullDisplayText, showBigImage}

/*
* 笔记
* */
/*
// 向小组件内传参
var maskingComponent = new masking({
  data: {abc: 'loadingIndex.js中传进去的参数'}
}).$mount()
*/
