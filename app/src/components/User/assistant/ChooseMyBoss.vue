<template>
    <div id="ChooseMyBoss">
      <p class="AppAllExplain">{{msg}}</p>
      <!-- 数据写法 -->
      <div>
        <!--搜索-->
        <div style="text-align: center; padding: 30px;">
          <input style="padding: 5px; font-size: 18px; width: 500px;" type="text" placeholder="按用户名搜索......" v-model="searchData.userName" @keyup.enter="getUsersListBySearch">
          <button @click="getUsersListBySearch">确定</button>
        </div>
        <table>
          <thead>
            <tr>
              <th>用户名</th>
              <th>电话</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(user, index) in usersList" :key="index">
              <td style="text-decoration: underline; color: deepskyblue; cursor: pointer;" @click="chooseBoss(user._id, user.userName)">{{user.userName}}</td>
              <td>{{user.telephone}}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
</template>

<script>
export default {
  name: 'choose-my-boss',
  data () {
    return {
      msg: '选择店长界面',
      usersList: [], // 用户列表
      operateUser: {}, // 操作用户
      searchData: {
        identity: 'boss', // 按身份检索
        userName: '' // 用户名
      }
    }
  },
  created () {
    var vm = this
    this.operateUser = this.$jsfn.determineUserLoginSuccess() // 调用'src/assets/js/jsfn.js'中判断用户登录函数
    if (this.operateUser) {
      console.log('用户已登录')
      vm.getUsersListBySearch()
    } else {
      console.log('用户未登录', vm.operateUser)
      vm.$message({
        type: 'warning',
        message: '请先登录'
      })
    }
    // 调用登录窗口【在User.vue中已经调用过】
  },
  methods: {
    /*
    * 获取函数
    * */
    // 通过筛选条件获取用户列表
    getUsersListBySearch () {
      console.log('通过筛选条件获取用户列表', this.searchData)
      this.$sendRequest.RTSPost('/rm_users/users_by_searchData', {operateUser: '获取操作者用户id', searchData: this.searchData}).then(res => {
        // console.log('请求到用户全部数据')
        if (res.data.code === 0) {
          // console.log('查询成功')
          console.log(res)
          this.usersList = res.data.data
        } else if (res.data.code === 1) {
          // console.log('查询出错')
          this.$windowFn.allWindow('GoodsList', 'remind', res.data.msg + '刷新一下试试', {agree: '晓得了', cancel: ''}) // 调用提示弹窗
        }
      })
    },
    /*
    * 本页函数
    * */
    /* -------------共用函数-------------- */

    /* -------------函数------------------ */
    // 选择店长 ----------------------------------------------------------------to-do【需要给选择的店长推送消息，并获得店长同意后才可选择成功】
    chooseBoss (userId, userName) {
      console.log('选择店长', userId, userName)
      this.$sendRequest.RTSPost('/rm_users/assistant_choose_myBoss', {operateUser: this.operateUser, updateData: {myBoss: userName}, bossId: userId}).then(res => {
        console.log(res)
        var status
        if (res.data.code === 0) {
          status = 'success'
          this.$router.push({name: 'UserMsg'}) // 转到用户个人信息页面
        } else {
          status = 'warning'
        }
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
