// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue' // 引用vue类库
import App from './App'
import router from './router'

/* 插件 */
import axios from 'axios' // 引入axios插件
import './assets/plugin/iconfont/iconfont.css' // 全局引入阿里矢量图标库
import VueLazyLoad from 'vue-lazyload' // 引入图片懒加载插件
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import md5 from 'js-md5' // 引入md5加密插件
import store from './assets/Vuex/store' // 引入Vuex

/* 自定义函数 */
import jsfn from './assets/js/jsfn' // 全局引入公用函数
import sendRequest from './assets/js/sendRequest' // 全局引入发送请求函数
import windowFn from './assets/js/windowFn' // 全局引入弹窗函数
import textShowFn from './assets/js/textShowFn' // 全局引入文本展示函数

/* 过滤器 */
import * as countFilter from './assets/js/filters/countFilter' // 计算过滤器
import * as textFilter from './assets/js/filters/textFilter' // 文本过滤器

Vue.config.productionTip = false // 阻止vue在启动时生成成产提示

axios.defaults.withCredentials = true // 解决跨域请求node无法操作cookie存入Application的cookies库
Vue.prototype.$http = axios // 将axios绑定到原型上
Vue.prototype.$jsfn = jsfn // 将jsfn函数文件绑定到原型上
Vue.prototype.$sendRequest = sendRequest // 将sendRequest函数文件绑定到原型上
Vue.prototype.$windowFn = windowFn // 将windowsFn函数文件绑定到原型上
Vue.prototype.$textShowFn = textShowFn // 将fullDisplayText函数文件绑定到原型上
Vue.prototype.$md5 = md5 // 将md5绑定到原型上
Vue.prototype.$store = store // 将Vuex的store绑定到原型上

for (var keyC in countFilter) { // 计算过滤器
  Vue.filter(keyC, countFilter[keyC])
}
for (var keyT in textFilter) { // 文本过滤器
  Vue.filter(keyT, textFilter[keyT])
}

// 图片懒加载
Vue.use(VueLazyLoad, {
  preload: 1.3, // 预加载的宽高
  loading: require('./assets/image/YMTloading.jpg'), // loading图片
  error: require('./assets/image/shark.jpg'), // 图片加载失败的图片
  attempt: 3 // 尝试加载的次数
  // listenEvents:['scroll','wheel','mousewhell','resize','animationend','transitionend','touchhmove'] // 你想让vue监听的事件
})

Vue.use(ElementUI)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router, // 声明路由
  components: { App },
  template: '<App/>'
})

// console.log = function () {} // 屏蔽系统中所有console.log打印
