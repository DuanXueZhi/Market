<template>
    <div id="UserRegister">
      <p class="AppAllExplain">{{msg}}</p>
      <top-base></top-base>
      <!-- 数据写法 -->
      <div>
        <p id="identity">身份<span style="color: red;" v-if="user.identity === ''">*</span>：<span style="color: dodgerblue;">{{user.identity | EnglishTranslate}}</span>注册</p>
        <button @click="user.identity = 'onlineBuyer'" :disabled="$store.state.user.identity !== ''">在线购买者注册</button>
        <button @click="user.identity = 'boss'" :disabled="$store.state.user.identity !== ''">商家注册（需要管理员审核）</button>
        <button @click="user.identity = 'assistant'" :disabled="!agreeAssistantRegister && !($store.state.user.identity === 'boss')">店员注册（需要商家登录）</button>
        <!-- 以后做成顶部标签切换模式，类似‘账号密码登录’vs‘扫一扫’ -->
        <span style="color: red;" v-if="mustFilled === 'identity'">此项必选</span>
      </div>
      <div>
        <p id="userName">用户名<span style="color: red;" v-if="user.userName === ''">*</span>：</p>
        <input type="text" v-model="user.userName" placeholder="用户名必须唯一"><span style="color: red;" v-if="mustFilled === 'userName'">此项必填</span>
        <p>密码：</p>
        <input type="password" v-model="user.userPassword">
        <p>确认密码：</p>
        <input type="password" v-model="confirmPassword"><span style="color: red;" v-if="!contrastPassword">两次密码不同</span>
        <p>电话：</p>
        <input type="number" v-model="user.telephone"><span style="color: red;" v-if="!checkoutTelephone">手机号有误</span>
        <div><button @click="submitUserMsg">注册</button></div>
        <p style="color: red;" v-if="mustFilled !== false && mustFilled !== true">注册{{mustFilled | EnglishTranslate}}为空</p>
        <span style="color: red;" v-if="!contrastPassword">两次密码不同</span>
      </div>
    </div>
</template>

<script>
import TopBase from '../Base/TopBase'

export default {
  name: 'user-register',
  components: {
    'TopBase': TopBase
  },
  data () {
    return {
      msg: '用户注册页面',
      // --------------------------------用户数据------------------------------------ \\
      user: { // 用户信息
        userName: '', // 用户名
        userPassword: '', // 用户密码
        identity: '', // 用户身份
        telephone: '' // 用户电话
      },
      // --------------------------------本页数据------------------------------------ \\
      confirmPassword: '', // 用户确认密码
      mustFilled: false, // 网页必填项
      operateUser: {}, // 操作者，需要直接获取
      agreeAssistantRegister: false // 是否允许店员注册【在线用户、店员、管理员】不允许店员注册，仅店长（boss）身份可以
    }
  },
  created () {
    this.operateUser = this.$jsfn.determineUserLoginSuccess() // 调用'src/assets/js/jsfn.js'中判断用户登录函数
    if (this.operateUser) {
      console.log('UserRegister用户已登录')
      // 判断当前用户登录身份
      if (this.operateUser.identity === 'boss') {
        // 允许店员用户注册
        this.agreeAssistantRegister = true
      } else {
        console.log('提示退出当前用户')
      }
    } else {
      console.log('UserRegister用户未登录')
    }
  },
  computed: {
    // 比较两次输入密码
    contrastPassword () {
      if (this.confirmPassword) {
        return this.confirmPassword === this.user.userPassword
      } else {
        return true
      }
    },
    // 校验手机号输入
    checkoutTelephone () {
      var reg = new RegExp('^((13[0-9])|(14[5,7])|(15[0-3, 5-9])|(17[0, 3, 5-8])|(18[0-9])|166|198|199|(147))\\d{8}$')
      if (this.user.telephone) {
        return reg.test(this.user.telephone)
      } else {
        return true
      }
    }
  },
  methods: {
    /*
    * 获取函数
    * */

    /*
    * 本页函数
    * */
    // ------------------------公用函数----------------------
    // 锚点跳转
    goAnchor (selector) {
      this.$el.querySelector(selector).scrollIntoView() // querySelector：css选择器，scrollIntoView：页面滚动参数默认true（顶部），false页面滚动到底部
    },

    // 判空函数
    emptyShow () {
      console.log('判空提示函数')
      if (this.user.identity === '') {
        this.mustFilled = 'identity'
        this.goAnchor('#identity')
      } else if (this.user.userName === '') {
        this.mustFilled = 'userName'
        this.goAnchor('#userName')
      } else {
        this.mustFilled = true
      }
    },
    // ------------------------函数--------------------------
    // 提交用户注册信息
    submitUserMsg () {
      console.log('提交用户注册信息')
      this.emptyShow() // 判断有无空值
      if (this.mustFilled === true && this.contrastPassword && this.checkoutTelephone) { // 确认没有空值、两次密码一致、手机号码成立、邮箱成立
        // md5加密一下 ------------------------------------------------------------------------------- to-do
        console.log(this.user)
        this.$sendRequest.RTSPost('/rm_users/add_user', {user: this.user, operateUser: this.operateUser}).then(res => {
          console.log(res)
          var status
          if (res.data.code === 0) {
            status = 'success'
            // 跳转到登录窗口
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
}
</script>

<style scoped>

</style>
