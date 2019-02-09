<template>
  <div id="LoginWindow" v-if="show">
    <p class="AppAllExplain">{{msg}}</p>
    <div class="AllBaseBackgroundMasking" v-on:click="close"></div><!--公用蒙版，样式代码在base.less文件中-->
    <div class="window">
      <p class="AppAllExplain">{{msg}}内部</p>
      <div class="head">
        <span class="close" v-on:click="close">×</span>
      </div>
      <div class="body">
        <div class="inputBox" title="账号为用户名或注册手机号">
          <span>账&nbsp;&nbsp;号：</span>
          <input type="text" v-model="user.userName" placeholder="用户名/手机号">
        </div>
        <div class="inputBox">
          <span>密&nbsp;&nbsp;码：</span>
          <input type="password" v-model="user.userPassword" @keyup.enter="operateBtn(true)">
        </div>
        <div class="optionBox">
          <p class="optionText">
            <el-checkbox v-model="rememberPassword" :disabled="user.userName === '' || user.userPassword === ''" @change="changePassword(rememberPassword, user.userName, user.userPassword)">记住密码</el-checkbox>
          </p>
          <p class="errorMsgText" v-if="errorMsg">{{errorMsg}}</p>
        </div>
      </div>
      <div class="footer">
        <span class="confirm" v-on:click="operateBtn(true)">登录</span>
        <span class="cancel" v-on:click="operateBtn(false)">取消</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'login-window',
  data () {
    return {
      msg: '用户登录弹窗小组件',
      show: false, // 组建展示
      afterCloseFn: '', // 弹窗关闭要执行的函数
      loginSuccessNextFn: '', // 登录成功后执行的函数
      user: {
        userName: '',
        userPassword: ''
      },
      errorMsg: false, // 错误提示语
      rememberPassword: false, // 是否记住密码
      loginSuccess: false // 是否登录成功【用于决定弹窗关闭时用户是否登录成功】
    }
  },
  created () {
    this.user.userName = localStorage.getItem('userName') === null ? '' : localStorage.getItem('userName') // 从localStorage中获取用户名
    this.user.userPassword = localStorage.getItem('userPassword') === null ? '' : localStorage.getItem('userPassword') // 从localStorage中获取密码
    if (this.user.userPassword !== '') { // 密码保存不等于''或null，说明有密码，则需要使用Decrypt解密【Encrypt(null)和Encrypt('')都有加密效果】
      this.user.userPassword = this.$jsfn.Decrypt(this.user.userPassword)
    }
    if (this.user.userName !== '' && this.user.userPassword !== '') { // 擦看有无并更新记住密码按钮状态
      this.rememberPassword = true
    }
  },
  methods: {
    // 关闭
    close () {
      console.log('关闭弹窗')
      this.show = false
      if (!this.loginSuccess) {
        this.afterCloseFn()
      } else {
        console.log('用户已成功登录')
      }
    },
    // 判空函数
    emptyShow (value) {
      console.log('判空提示函数')
      if (this.user.userName === '') {
        this.errorMsg = (value === 'login' ? '登录失败：' : '操作失败：') + '用户名输入为空'
      } else if (this.user.userPassword === '') {
        this.errorMsg = (value === 'login' ? '登录失败：' : '操作失败：') + '密码输入为空'
      } else {
        this.errorMsg = true
      }
    },

    // 选择是否记住密码
    changePassword (event, userName, userPassword) {
      if (event) { // 选中
        console.log('记住密码')
        // 将返回值储存到Session Storage中
        localStorage.setItem('userName', userName)
        localStorage.setItem('userPassword', this.$jsfn.Encrypt(userPassword)) // 存入（crypto-js）加密后的字符串
      } else {
        console.log('不记住密码')
        localStorage.removeItem('userName')
        localStorage.removeItem('userPassword')
      }
    },

    // 确认or取消（底部操作按钮）
    operateBtn (option) {
      var vm = this
      console.log('登录弹窗中点击底部按钮操作')
      if (option) {
        this.emptyShow('login') // 判空
        console.log('登录弹窗中点击确认', this.errorMsg)
        if (this.errorMsg === true) {
          this.$sendRequest.RTSPost('/rm_users/user_login', {user: this.user}).then(res => {
            console.log(res)
            this.errorMsg = res.data.msg // 更新提示语
            var status // 提示语类型
            if (res.data.code === 0) { // 登录成功
              status = 'success'
              console.log(res.data.data)
              this.changePassword(vm.rememberPassword, vm.user.userName, vm.user.userPassword) // 是否记住密码【记住：更新一下，未选：删除其中的值】
              this.$store.commit('updateUserInfo', res.data.data)
              this.loginSuccess = true
              this.close() // 关闭提示弹窗
              this.loginSuccessNextFn()// 执行下一步操作
            } else {
              status = 'warning'
            }
            this.$message({
              message: res.data.msg,
              type: status
            })
          })
        }
      } else {
        console.log('登录弹窗中点击取消')
        this.close() // 关闭弹窗
      }
    }
  }
}
</script>

<style scoped lang="less">
  @import '../../../assets/less/main';

  #LoginWindow{
    .window{
      z-index: 11; /*Masking蒙版部分是10*/
      position: fixed;
      left: 0;
      right: 0;
      top: 50%;
      margin: auto;
      .transform(translate(0, -50%));
      width: 500px;
      background: #fff;
      .border_radius(8px);
      overflow: hidden;
      .head{
        height: 44px;
        background: @color-secondary;
        .close{
          float: right;
          margin-right: 10px;
          font-size: 30px;
          cursor: pointer;
          color: #fff;
        }
        .close:hover{

        }
      }
      .body{
        border-top: 1px solid #666;
        padding: 10px 20px;
        .inputBox{
          padding: 22px 16px;
          color: @color-primary;
          font-family: 'STHupo';
          font-size: 22px;
          >input{
            font-size: 16px;
            width: 320px;
            padding: 4px;
            .border_radius(6px);
            border: 1px solid @color-secondary;
            .box_shadow(1px 1px 4px @color-secondary-deep);
          }
        }
        .optionBox{
          text-align: right;
          padding: 0 22px 0 16px;
          >p{
            display: inline-block;
            &.errorMsgText{
              float: left;
              color: red;
            }
          }

        }
      }
      .footer{
        padding-bottom: 20px;
        text-align: center;
        font-weight: 900;
        span{
            border: 1px solid @color-secondary; // 使用副色调
            padding: 4px 10px;
            .border_radius(4px);
            cursor: pointer;
            &.confirm{
              background: @color-secondary-tint; // 使用副色调浅
              color: #fff;
              margin-right: 4px;
            }
            &.cancel{
              color: @color-secondary; // 使用副色调
              margin-left: 4px;
            }
          }
      }
    }
  }
</style>
