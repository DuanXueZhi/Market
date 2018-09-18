/*
* 该文件夹下所有loading、window的入口文件，导出所有Vue.extend构造后的值
* 创建于 2018/08/14
* */
import Vue from 'vue'
// loading文件
import normalLoadingVue from './loading/NormalLoading' // 正常加载（加载中...）
// window文件
import warningRemindWindowVue from './window/WarningRemindWindow' // 警告弹窗

const normalLoading = Vue.extend(normalLoadingVue) // 将vue文件作为构造器的参数
const warningRemindWindow = Vue.extend(warningRemindWindowVue)

export default {normalLoading, warningRemindWindow}

/*
* 笔记
* */
/*
// 向小组件内传参
var maskingComponent = new masking({
  data: {abc: 'loadingIndex.js中传进去的参数'}
}).$mount()
*/
