<template>
    <div id="User">
      <p class="AppAllExplain">{{msg}}</p>
      <!--数据写法-->
      <!--头部-->
      <div>
        <p>User之后要写成组件拼接进来</p>
        <!--公用菜单-->
        <router-link to="/UserRegister">店员注册【要传一个店员参数】</router-link>
        <router-link :to="{name: 'UserMsg'}">|我的信息</router-link>
        <router-link>|我的消息</router-link>
        <router-link to="/Home">|购物车</router-link>
        <!-- 管理员列表 -->
        <div v-if="operateUser.identity === 'admin'">
          <p style="color: red;">admin</p>
          <router-link :to="{name: 'UsersList'}">|用户列表</router-link>
        </div>
        <!-- 商家列表 -->
        <div v-if="operateUser.identity === 'boss'">
          <p style="color: red;">boss</p>
          <router-link to="/Home">|我的顾客</router-link>
          <router-link to="/Home">|我家品牌</router-link>
          <router-link to="/Home">|我的雇员</router-link>
          <router-link to="/Home">|我的顾客</router-link>
        </div>
        <!-- 店员列表 -->
        <div v-if="operateUser.identity === 'assistant'">
          <p style="color: red;">assistant</p>
          <router-link to="/Home">|我家顾客</router-link>
          <router-link to="/Home">|我家品牌</router-link>
          <router-link to="/Home">|提出辞职</router-link>
          <router-link :to="{name: 'ChooseMyBoss'}" v-if="showChooseMyBoss">|选择店长</router-link>
        </div>
        <router-link to="/Home">|返回主页</router-link>
      </div>
      <!--主体-->
      <router-view></router-view>
      <!--底部-->
      <div>
        <p>User之后要写成组件拼接进来</p>
      </div>
      <!--数据写法-->
    </div>
</template>

<script>
export default {
  name: 'User',
  data () {
    return {
      msg: '用户页面【包括注册、个人信息等界面】',
      operateUser: { // 操作者用户，从vuex中获取【userId, userName, identity, myBoss, chooseStoreOwner】
        identity: ''
      },
      showChooseMyBoss: false // 是否展示【选择店长】按钮
    }
  },
  created () {
    var vm = this
    this.operateUser = this.$jsfn.determineUserLoginSuccess() // 调用'src/assets/js/jsfn.js'中判断用户登录函数
    if (this.operateUser) {
      console.log('User用户已登录')
      // 判断是否是assistant身份，并判断该用户myBoss字段有无值，【无：提示用户选择商家；有：不做提示】
      if (this.operateUser.identity === 'assistant') {
        console.log('身份是店员')
        switch (this.operateUser.chooseStoreOwner) { // 判断店长选择状态【-1：(无店长)未选择，0：已有店长，1：(无店长)已选择(待店长审核)】
          case -1:
            console.log('未选择店长，请选择')
            this.showChooseMyBoss = true // 展示选择店长按钮
            this.$router.push({name: 'ChooseMyBoss'}) // 转到用户个人信息页面
            break
          case 0:
            console.log('不操作')
            break
          case 1:
            console.log('待审核，禁止进入')
            break
        }
      }
    } else {
      console.log('User用户未登录', this.operateUser)
      this.$message({
        type: 'warning',
        message: '请先登录'
      })
      vm.$windowFn.openLoginWindow('body', {}, function () { vm.$router.push('/Home') }, function () { vm.$router.push('/User') })
    }
  }
}
</script>

<style scoped>

</style>
