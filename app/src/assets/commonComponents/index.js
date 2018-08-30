/*
* 导入公共模板组件
* */
import KikoLoading from './loading/index'

const install = function (Vue) {
  Vue.component(KikoLoading.name, KikoLoading) // 注册组件
}

export default install
