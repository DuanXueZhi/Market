/*
* 该文件夹下所有loading、window的入口文件，导出所有Vue.extend构造后的值
* 创建于 2018/08/14
* */
import Vue from 'vue'
// loading文件
import maskingVue from './loading/Masking' // 基础蒙版
import normalLoadingVue from './loading/NormalLoading' // 正常加载（加载中...）
// window文件
import warningWindowVue from './window/WarningWindow' // 警告弹窗

const masking = Vue.extend(maskingVue) // 将vue文件作为构造器的参数
const normalLoading = Vue.extend(normalLoadingVue)
const warningWindow = Vue.extend(warningWindowVue)

export default {masking, normalLoading, warningWindow}

/*
* 笔记
* */
/*
// 向小组件内传参
var maskingComponent = new masking({
  data: {abc: 'loadingIndex.js中传进去的参数'}
}).$mount()
*/
