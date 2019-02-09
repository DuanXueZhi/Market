import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex) // 使用Vuex
// 创建一个常量对象
const state = {
  user: {
    userId: '', // 用户_id
    userName: '', // 用户名
    identity: '', // 身份
    myBoss: '', // 我的店长
    chooseStoreOwner: '' // 是否已选择店长【默认为0，-1：(无店长)未选择，0：已有店长，1：(无店长)已选择(待店长审核)】
  }
}
const mutations = {
// 所有mutations中的方法的第一个参数一定是state变量，用来进行对state中的状态的操作
// 第二个参数是可选参数，用于调用该 mutations 方法的时候传参
  updateUserInfo (state, user) { // 更新user信息
    state.user = user
    console.log('更新vuex中user的值', user)
  }
}
// 让外部引用vuex
export default new Vuex.Store({ // 创建vuex中的store对象
  state,
  mutations
})
