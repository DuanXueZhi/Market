<template>
    <div id="UsersList">
      <p class="AppAllExplain">{{msg}}</p>
      <!-- 数据写法 -->
      <div>
        <ul style="" @click="getUsersListBySearch">
          <li style="float: left; border: 1px solid black; border-left: 0; cursor: pointer; padding: 5px;" :class="{headerSearchActive: searchData.identity === ''}" @click="searchData.identity = ''">全部</li>
          <li style="float: left; border: 1px solid black; border-left: 0; cursor: pointer; padding: 5px;" :class="{headerSearchActive: searchData.identity === identity}" v-for="(identity, index) in identityList" :key="index" @click="searchData.identity = identity">{{identity | EnglishTranslate}}</li>
        </ul>
        <table>
          <thead>
            <tr>
              <th><input type="checkbox" v-on:change="checkAll($event)" :checked="$jsfn.contrastArray(DBIdArray, allIdArray)"></th>
              <th>序号</th>
              <th>用户名</th>
              <th>密码</th>
              <th>性别</th>
              <th>电话</th>
              <th>身份</th>
              <th>购物车</th>
              <th>地址列</th>
              <th>最后登录时间</th>
              <th>我的雇员（boos）</th>
              <th>我的雇主</th>
              <th>创建日期</th>
              <th>最后修改日期</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(user, index) in usersList" :key="index">
              <td><input type="checkbox" v-on:change="arrangeDBIdArray($event, user._id)" :checked="DBIdArray.indexOf(user._id) === -1? false : true"></td>
              <td>{{index + 1}}</td>
              <td>{{user.userName}}</td>
              <td>{{user.userPassword}}</td>
              <td>{{user.userSex}}</td>
              <td>{{user.telephone}}</td>
              <td>{{user.identity | EnglishTranslate}}</td>
              <td>{{user.shoppingTrolley}}</td>
              <td>{{user.addressList}}</td>
              <td>{{user.lastLoginTime | countDateChinese}}</td>
              <td>
                <ul>
                  <li v-for="(assistant, index) in user.myAssistant" :key="index">{{assistant}}</li>
                </ul>
              </td>
              <td>{{user.myBoss}}</td>
              <td>{{user.meta.createAt}}</td>
              <td>{{user.meta.updateAt | countDateChinese}}</td>
              <td>
                <button @click="deleteOneUserMsg(user._id)">删除</button>
                <button @click="resetOneUserPassword(user._id)">重置密码</button>
              </td>
            </tr>
          </tbody>
        </table>
        <div>
          <button @click="batchDelete">管理员批量删除</button>
          <button @click="invertSelection">反选</button>
        </div>
      </div>
    </div>
</template>

<script>
export default {
  name: 'users-list',
  data () {
    return {
      msg: '管理员查看用户界面',
      usersList: [], // 用户数据列表
      identityList: [ // 身份列表
        'onlineBuyer',
        'boss',
        'assistant',
        'admin'
      ],
      searchData: { // 用户列表筛选项
        identity: ''
      },
      DBIdArray: [], // 用户信息_id数组(用户操作)
      allIdArray: [], // 目前所有用户信息_id数组（后台获取）
      allItem: false // 全选按钮
    }
  },
  created () {
    this.getDataList()
  },
  methods: {
    /*
    * 获取函数
    * */
    // 获取数据列表函数
    getDataList () {
      // 请求数据（查询到数据库中exist=true的用户的所有信息admin身份用）
      this.$sendRequest.RTSGet('/rm_users/complete_users', {operateUser: '用户id'}).then(res => {
        // console.log('请求到用户全部数据')
        if (res.data.code === 0) {
          // console.log('查询成功')
          console.log(res)
          this.usersList = res.data.data
          this.usersList.forEach(e => { // 顺便得到所有的_id数组
            this.allIdArray.push(e._id)
          })
        } else if (res.data.code === 1) {
          // console.log('查询出错')
          this.$windowFn.allWindow('GoodsList', 'remind', res.data.msg + '刷新一下试试', {agree: '晓得了', cancel: ''}) // 调用提示弹窗
        }
      })
    },

    // 通过筛选条件获取用户列表
    getUsersListBySearch () {
      console.log('通过筛选条件获取用户列表', this.searchData)
      this.$sendRequest.RTSPost('/rm_users/users_by_searchData', {userId: '获取操作者用户id', searchData: this.searchData}).then(res => {
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
    // 操作（删除单个）用户信息函数
    deleteOneUserMsg (userId) {
      console.log('操作（删除）用户信息函数', userId)
      this.$sendRequest.RTSDelete('/rm_users//delete_users', {operateUser: '获取一下', userId: userId}).then(res => {
        var status
        if (res.data.code === 0) {
          status = 'success'
          this.getDataList() // 删除成功，调用获取数据函数
        } else {
          status = 'warning'
        }
        this.$message({
          message: res.data.msg,
          type: status
        })
      })
    },

    // 全选操作
    checkAll (event) {
      // console.log('全选操作', event.target.checked)
      if (event.target.checked) { // 全选
        this.DBIdArray = this.allIdArray.concat() // 直接拷贝所有_id数组
      } else {
        this.DBIdArray = [] // 制空（全不选）
      }
    },

    // 调整到货_id数组值
    arrangeDBIdArray (event, DBId) {
      if (event.target.checked) { // 选中
        // console.log('选中')
        if (this.DBIdArray.indexOf(DBId) === -1) { // 查看数组中有没有
          this.DBIdArray.push(DBId) // 添加到数组中
        } else {
          console.log('已存在，保险起见判断有无此_id再添加')
        }
      } else {
        console.log('取消')
        while (this.DBIdArray.indexOf(DBId) !== -1) { // 一直删除直到数组中没有了【保险起见】
          console.log('while循环')
          this.DBIdArray.splice(this.DBIdArray.indexOf(DBId), 1) // 放弃：剔除
        }
      }
    },

    // 批量删除
    batchDelete () {
      console.log('批量删除', this.DBIdArray)
      this.$sendRequest.RTSDelete('/rm_users/delete_users_batch', {operateUser: '需要获取', idArray: this.DBIdArray}).then(res => {
        var status
        if (res.data.code === 0) {
          console.log('批量删除成功')
          status = 'success'
          this.getDataList() // 删除成功，调用获取数据函数
        } else if (res.data.code === 1) {
          console.log('批量删除出错')
          status = 'warning'
          this.$windowFn.allWindow('PurchasesList', 'remind', res.data.msg + '刷新一下试试', {agree: '晓得了', cancel: ''}) // 调用提示弹窗
        }
        this.$message({
          message: res.data.msg + res.data.data.n + '条数据',
          type: status
        })
      })
    },

    // 反选
    invertSelection () {
      console.log('反选')
      var idArray = this.DBIdArray.concat()
      this.DBIdArray = [] // 先清空一下原值
      this.usersList.forEach(e => { // 将目前列表数据中的_id push进到货信息_id数组中
        if (idArray.indexOf(e._id) === -1) {
          this.DBIdArray.push(e._id)
        }
      })
    },

    // 重置用户密码
    resetOneUserPassword (userId) {
      console.log('重置用户密码', userId)
      var updateData = {userPassword: '000000'}
      this.$sendRequest.RTSPost('/rm_users/update_users', {operateUser: '需要获取一下', _id: userId, updateData: updateData}).then(res => {
        console.log(res)
        var status, msg
        if (res.data.code === 0) {
          status = 'success'
          msg = '用户重置密码成功'
          this.getDataList() // 删除成功，调用获取数据函数
        } else {
          status = 'warning'
          msg = '用户重置密码失败'
        }
        this.$message({
          message: msg,
          type: status
        })
      })
    }
  }
}
</script>

<style scoped lang="less">
  #UsersList{
    .headerSearchActive{ /* 每个表头活跃 */
      background: #df5000;
      color: #d6ff00;
    }
  }
</style>
