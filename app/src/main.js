// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

/* 插件 */
import axios from 'axios' // 引入axios插件
import './assets/plugin/iconfont/iconfont.css' // 全局引入阿里矢量图标库

/* 自定义函数 */
import jsfn from './assets/js/jsfn' // 全局引入公用函数
import sendRequest from './assets/js/sendRequest' // 全局引入发送请求函数
import windowFn from './assets/js/windowFn' // 全局引入弹窗函数

import './assets/commonComponents/index' // 实验(案例公共蒙版)

Vue.config.productionTip = false
Vue.prototype.$http = axios // 将axios绑定到原型上
Vue.prototype.$jsfn = jsfn // 将jsfn函数文件绑定到原型上
Vue.prototype.$sendRequest = sendRequest // 将sendRequest函数文件绑定到原型上
Vue.prototype.$windowFn = windowFn // 将windowsFn函数文件绑定到原型上

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
