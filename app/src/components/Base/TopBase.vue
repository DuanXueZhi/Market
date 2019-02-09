<template>
  <div id="TopBase">
    <p class="AppAllExplain">{{msg}}</p>
    <div class="topBox">
        <div class="topBody">
          <ul class="leftList">
            <li class="listItem"><i class="iconfont icon-dingwei"></i>北京</li>
          </ul>
          <ul class="rightList">
            <li class="listItem">
              <div class="itemBox">
                <span class="itemBtn" v-if="!$store.state.user.userName" @click="invokingLoginWindow">登录</span>
                <el-dropdown size="mini" split-button type="primary" v-if="$store.state.user.userName" @click="$router.replace('/User')" @command="userHandleCommand">
                  欢迎！{{$store.state.user.userName}}
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item>购物车</el-dropdown-item>
                    <el-dropdown-item>狮子头</el-dropdown-item>
                    <el-dropdown-item>螺蛳粉</el-dropdown-item>
                    <el-dropdown-item>双皮奶</el-dropdown-item>
                    <el-dropdown-item command="loginOut">注销</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </div>
            </li>
            <li class="spacer">|</li>
            <li class="listItem">
              <div class="itemBox">
                <router-link class="itemBtn" to="/UserRegister">免费注册</router-link>
              </div>
            </li>
            <li class="spacer">|</li>
            <li class="listItem">
              <div class="itemBox">
                <span class="itemBtn" @click="invokingLoginWindow">我的订单</span>
              </div>
            </li>
            <li class="spacer">|</li>
            <li class="listItem">
              <div class="itemBox">
                <span class="itemBtn" @click="invokingLoginWindow">网站导航</span>
              </div>
            </li>
            <li class="spacer">|</li>
            <li class="listItem">
              <div class="itemBox">
                <router-link class="itemBtn" to="/Home">主页</router-link>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
</template>

<script>
export default {
  name: 'TopBase',
  data () {
    return {
      msg: '基础顶部组件'
    }
  },
  created () {},
  methods: {
    /*
    * 获取函数
    * */
    /*
    * 公用函数
    * */

    invokingLoginWindow () {
      console.log('调用登录弹窗')
      this.$windowFn.openLoginWindow('body', {}, '', '')
    },

    // 用户按钮下拉菜单点击事件
    userHandleCommand (command) {
      switch (command) {
        case 'loginOut':
          this.loginOut()
      }
    },

    // 用户退出
    loginOut () {
      console.log('用户退出')
      this.$sendRequest.RTSGet('/rm_users/user_logout', this.$store.state.user).then(res => {
        console.log(res)
        var status // 提示语类型
        if (res.data.code === 0) { // 用户退出成功
          status = 'success'
          this.$router.push('/Home') // 跳转至首页
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

<style scoped lang="less">
  #TopBase{
    font-size: 12px;
    .topBox{
      border-bottom: 1px solid #ddd;
      background-color: #e3e4e5;
      overflow: hidden;
      .topBody{
        height: 30px;
        line-height: 30px;
        color: #999;
        margin: auto;
        width: 1190px;
        .leftList, .rightList{
          >li{
            display: inline-block;
            float: left;
            margin: 0 6px;
            &.listItem{
              .itemBox{
                .itemBtn{
                  cursor: pointer;
                  color: #999;
                  &:hover{
                    color: red;
                  }
                }
              }
            }
          }

        }
        .leftList{
          .listItem{
            .icon-dingwei{
              color: red;
            }
          }
        }
        .rightList{
          float: right;
        }
      }
    }
  }
</style>
