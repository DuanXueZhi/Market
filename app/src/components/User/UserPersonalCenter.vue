<template>
    <div id="UserPersonalCenter">
      <p class="AppAllExplain">{{msg}}</p>
        <h3>欢迎{{$store.state.user.userName}}</h3>
        <h4>{{$store.state.user.identity}}身份</h4>
        <button @click="loginOut">退出登录</button>
    </div>
</template>

<script>
export default {
  name: 'user-personal-center',
  data () {
    return {
      msg: '用户个人中心界面',
      operateUser: { // 操作者用户，从vuex中获取
        userId: '',
        userName: '',
        identity: ''
      }
    }
  },
  created () {
    this.operateUser = this.$store.state.user
    if (this.operateUser.userId && this.operateUser.userName && this.operateUser.identity) {
      console.log('用户已登录')
    } else {
      console.log('用户未登录')
      this.$router.push('/Home') // 跳转至主页
    }
  },
  methods: {
    /*
    * 获取函数
    * */
    /*
    * 公用函数
    * */
    // 用户退出
    loginOut () {
      var vm = this
      console.log('用户退出')
      this.$sendRequest.RTSGet('/rm_users/user_logout', this.$store.state.user).then(res => {
        console.log(res)
        var status // 提示语类型
        if (res.data.code === 0) { // 用户退出成功
          status = 'success'
          vm.$router.push('/Home') // 跳转至主页
        } else {
          status = 'warning'
          // 登录身份过期 ‘或’ 操作用户、cookies用户、session用户，三值不相等 【重新登录】
          // 随即再次点击【登录】按钮即可调用登录弹窗，并即刻后台将新的用户数据更新到浏览器Cookies中，并通过登录成功后回调更新vuex中store的user值，
        }
        this.$store.state.user = {userId: '', userName: '', identity: ''} // 清空vuex中store的user值
        this.$message({
          message: res.data.msg,
          type: status
        })
      })
    }
  }
}
</script>

<style scoped>

</style>
