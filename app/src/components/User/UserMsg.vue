<template>
    <div id="UserMsg">
      <p class="AppAllExplain">{{msg}}</p>
      <div class="userMsgBox">
        <div style="border: 1px solid #DEDEDE; padding: 20px;">
          <ul style="border-bottom: 1px solid #DEDEDE;">
            <li>
              <span>基本信息</span>
              <button style="float: right;" @click="updateUserMsg('baseMsg')" v-if="!baseMsgUpdate">编辑</button>
              <button style="float: right;" @click="submitUpdateDate('baseMsg')" v-if="baseMsgUpdate">保存</button>
            </li>
            <li style="text-align: center;"><span>用户名：</span><span>{{userMsg.userName}}</span></li>
            <li style="text-align: center;"><span>身份：</span><span>{{userMsg.identity}}</span></li>
            <li style="text-align: center;"><span>头像：</span><span>{{userMsg.userImage}}</span></li>
            <li style="text-align: center;" v-if="!baseMsgUpdate"><span>性别：</span><span>{{userMsg.userSex}}</span></li>
            <li style="text-align: center;" v-if="baseMsgUpdate"><span>性别：</span><input type="text" v-model="userNewMsg.userSex"></li>
          </ul>
          <ul style="border-bottom: 1px solid #DEDEDE;">
            <li>
              <span>联系方式</span>
              <button style="float: right;" @click="updateUserMsg('communicationMsg')" v-if="!communicationMsgUpdate">编辑</button>
              <button style="float: right;" @click="submitUpdateDate('communicationMsg')" v-if="communicationMsgUpdate">保存</button>
            </li>
            <li style="text-align: center;" v-if="!communicationMsgUpdate"><span>手机号：</span><span>{{userMsg.telephone}}</span></li>
            <li style="text-align: center;" v-if="communicationMsgUpdate"><span>手机号：</span><input type="text" v-model="userNewMsg.telephone"></li>
            <li style="text-align: center;"><span>购物车：</span><span>我的购物车</span></li>
            <li style="text-align: center;">
              <span>地址：</span>
              <ul>
                <li v-for="(addressItem, index) in userMsg.addressList" :key="index" v-if="!communicationMsgUpdate"><span>{{addressItem}}</span></li>
                <li v-for="(addressItem, index) in userNewMsg.addressList" :key="index" v-if="communicationMsgUpdate"><span>{{addressItem}}</span></li>
              </ul>
            </li>
          </ul>
          <ul style="border-bottom: 1px solid #DEDEDE;">
            <li>
              <span>附加信息</span>
              <button style="float: right;" @click="updateUserMsg('adjunctionMsg')" v-if="!adjunctionMsgUpdate">编辑</button>
              <button style="float: right;" @click="submitUpdateDate('adjunctionMsg')" v-if="adjunctionMsgUpdate">保存</button>
            </li>
            <li style="text-align: center;"><span>最后登录时间：</span><span>{{userMsg.lastLoginTime}}</span></li>
            <li style="text-align: center;" v-if="!adjunctionMsgUpdate">
              <span>我的店员：</span>
              <el-tag v-for="(assistant, index) in userMsg.myAssistant" :key="index" style="margin: 0 4px;">{{assistant}}</el-tag>
            </li>
            <li style="text-align: center;" v-if="adjunctionMsgUpdate">
              <span>我的店员：</span>
              <el-tag
                v-for="(assistant, index) in userNewMsg.myAssistant"
                :key="index"
                closable
                type=''
                @close="deleteMyAssistant(assistant)"
                style="margin: 0 4px;">
                {{assistant}}
              </el-tag>
            </li>
            <li style="text-align: center;"><span>我的店长：</span><span>{{userMsg.myBoss}}</span></li>
            <li style="text-align: center;" v-if="userMsg.meta && userMsg.meta.createAt"><span>创建时间：</span><span>{{userMsg.meta.createAt}}</span></li>
            <li style="text-align: center;" v-if="userMsg.meta && userMsg.meta.updateAt"><span>最后修改时间：</span><span>{{userMsg.meta.updateAt}}</span></li>
          </ul>
        </div>
      </div>
    </div>
</template>

<script>
export default {
  name: 'user-msg',
  data () {
    return {
      msg: '用户个人信息界面',
      operateUser: {}, // 操作用户
      searchData: { // 筛选信息
        _id: '' // 用户_id
      },
      userMsg: {}, // 查询到的用户信息
      baseMsgUpdate: false, // 基础信息编辑
      communicationMsgUpdate: false, // 联系信息编辑
      adjunctionMsgUpdate: false, // 附加信息编辑
      userNewMsg: { // 用户新信息
        userSex: '',
        telephone: '',
        addressList: [],
        myAssistant: [],
        deleteAssistant: [] // 删除的店员
      },
      updateItem: {} // 修改数据【最后提交的数据】
    }
  },
  created () {
    var vm = this
    this.operateUser = this.$jsfn.determineUserLoginSuccess() // 调用'src/assets/js/jsfn.js'中判断用户登录函数
    if (this.operateUser) {
      console.log('用户已登录')
      vm.searchData._id = vm.operateUser.userId // 更新筛选项,查询用户
      vm.getUserIntegrityMsgByUserId() // 获取用户完整信息
    } else {
      console.log('用户未登录', vm.operateUser)
      vm.$message({
        type: 'warning',
        message: '请先登录'
      })
      // 调用登录窗口【在User.vue中已经调用过】
    }
  },
  methods: {
    /*
    * 获取函数
    * */
    // 获取用户完整信息
    getUserIntegrityMsgByUserId () {
      console.log('获取用户完整信息通过userId')
      this.$sendRequest.RTSPost('/rm_users/users_by_searchData', {searchData: this.searchData}).then(res => {
        console.log(res)
        if (res.data.code === 0) {
          this.userMsg = res.data.data
          this.userNewMsg.userSex = this.userMsg.userSex
          this.userNewMsg.telephone = this.userMsg.telephone
          this.userNewMsg.communicationMsgUpdate = this.userMsg.communicationMsgUpdate
          this.userNewMsg.myAssistant = this.userMsg.myAssistant.concat()
        }
      })
    },
    /*
    * 本页函数
    * */
    /* -------------共用函数-------------- */

    /* -------------函数------------------ */
    // 修改用户信息
    updateUserMsg (msgLocation) {
      console.log('修改用户信息', msgLocation)
      switch (msgLocation) {
        case 'baseMsg':
          console.log('修改基本信息')
          this.baseMsgUpdate = true // 基础信息编辑
          break
        case 'communicationMsg':
          console.log('修改通信信息')
          this.communicationMsgUpdate = true // 联系信息编辑
          break
        case 'adjunctionMsg':
          console.log('修改附加信息')
          this.adjunctionMsgUpdate = true // 附加信息编辑
          break
      }
    },

    // 删除店员（myAssistant）
    deleteMyAssistant (item) {
      console.log('删除店员', item)
      var index = this.userNewMsg.myAssistant.indexOf(item)
      if (index !== -1) {
        this.userNewMsg.deleteAssistant.push(item) // 记录已删除的店员名单
        this.userNewMsg.myAssistant.splice(index, 1)
        console.log(this.userNewMsg.myAssistant)
      } else {
        console.log('userNewMsg.myAssistant删除元素失败，未找到元素')
      }
    },

    // 整理修改数据
    updateUpdateItem () {
      console.log('整理修改数据')
      this.updateItem = {
        userSex: this.userNewMsg.userSex === this.userMsg.userSex ? '' : this.userNewMsg.userSex,
        telephone: this.userNewMsg.telephone === this.userMsg.telephone ? '' : this.userNewMsg.telephone,
        communicationMsgUpdate: this.userNewMsg.communicationMsgUpdate === this.userMsg.communicationMsgUpdate ? '' : this.userNewMsg.communicationMsgUpdate,
        myAssistant: this.$jsfn.contrastArray(this.userNewMsg.myAssistant, this.userMsg.myAssistant) ? '' : this.userNewMsg.myAssistant,
        deleteAssistant: this.userNewMsg.deleteAssistant === [] ? '' : this.userNewMsg.deleteAssistant
      }
    },

    // 提交修改信息
    submitUpdateDate (msgLocation) {
      this.updateUpdateItem() // 跟新一下修改数据
      // 发送修改请求，参数：_id：要修改用户的_id，updateData：改动数据，operateUser：执行此操作的用户
      this.$sendRequest.RTSPost('/rm_users/update_users', {_id: this.userMsg._id, updateData: this.updateItem, operateUser: this.operateUser}).then(res => {
        console.log(res)
        var status // 提示语状态
        var messageFrom // 保存按钮的来源
        if (res.data.code === 0) { // 成功
          status = 'success'
          switch (msgLocation) { // 判断修改的是哪（基础信息、联系信息、附加信息）部分
            case 'baseMsg':
              this.baseMsgUpdate = false // 基础信息提交
              messageFrom = '基础信息'
              break
            case 'communicationMsg':
              this.communicationMsgUpdate = false // 联系信息提交
              messageFrom = '联系信息'
              break
            case 'adjunctionMsg':
              this.adjunctionMsgUpdate = false // 附加信息提交
              messageFrom = '附加信息'
              break
          }
        } else {
          status = 'warning'
        }
        this.$message({
          message: res.data.msg + '（' + messageFrom + '）',
          type: status
        })
      })
    }
  }
}
</script>

<style scoped>

</style>
