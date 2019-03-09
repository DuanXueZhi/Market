<!-- 进货记录列表 创建于2019/01/08 -->
<template>
  <div id="PurchasesList">
    <p class="AppAllExplain">{{msg}}</p>
    <!--数据写法-->
    <div>
      <!--搜索-->
      <div style="text-align: center; padding: 30px;">
        <input style="padding: 5px; font-size: 18px; width: 500px;" type="text" placeholder="按到货商品名或到货厂商搜索......" v-model="searchData.inputCondition" @keyup.enter="getPurchasesBySearchData"
        ><button @click="getPurchasesBySearchData">确定</button>
      </div>
      <div style="float: right; margin-right: 20px;">
        <button @click="switchoverProductList(false)" v-bind="{disabled: !searchData.exist}">回收站</button>
      </div>
      <div style="float: right; margin-right: 20px;">
        <button @click="switchoverProductList(true)" v-bind="{disabled: searchData.exist}">到货信息列表</button>
      </div>
      <!--<div>-->
        <!--<span>时间：</span>-->
        <!--<select v-model="searchData.productPurchaseDate" v-on:change="getPurchasesDataBySearchData">-->
          <!--<option value="">全部</option>-->
          <!--<option :value="time._id" v-for="(time, index) in searchOneItemData" :key="index" @click="getPurchasesDataBySearchData">{{time._id | textCutOut(10)}}</option>-->
        <!--</select>-->
      <!--</div>-->
      <!--到货信息列表-->
      <table>
        <thead>
          <tr style="border: 1px solid steelblue;">
            <th><input type="checkbox" v-on:change="checkAll($event)" :checked="$jsfn.contrastArray(DBIdArray, allIdArray)"></th>
            <th>序号</th>
            <th style="border-left: 1px solid steelblue;">厂商</th>
            <th style="border-left: 1px solid steelblue;">商品名</th>
            <th style="border-left: 1px solid steelblue;">到货详细信息</th>
            <th style="border-left: 1px solid steelblue;">总数</th>
            <th style="border-left: 1px solid steelblue;">所属店铺</th>
            <th style="border-left: 1px solid steelblue;" v-if="operateUser.identity === 'boss'">总价</th>
            <th style="border-left: 1px solid steelblue;">运费</th>
            <th style="border-left: 1px solid steelblue;">缺少</th>
            <th style="border-left: 1px solid steelblue; color: red;">注意</th>
            <th style="border-left: 1px solid steelblue;">备注</th>
            <th style="border-left: 1px solid steelblue;">操作者</th>
            <th style="border-left: 1px solid steelblue;">创建时间</th>
            <th style="border-left: 1px solid steelblue;">修改时间</th>
            <th style="border-left: 1px solid steelblue;">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr style="border: 1px solid steelblue;" v-for="(purchaseMsg, index) in goodsPurchasesList" :key="index">
            <td><input type="checkbox" v-on:change="arrangeDBIdArray($event, purchaseMsg._id)" :checked="DBIdArray.indexOf(purchaseMsg._id) === -1? false : true"></td>
            <td>{{index + 1}}</td>
            <td>{{purchaseMsg.productPurchaseSeller}}</td>
            <td>{{purchaseMsg.productPurchaseName}}</td>
            <td>
              <table>
                <thead>
                  <tr>
                    <th>商品号</th>
                    <th v-if="operateUser.identity === 'boss'">进价</th>
                    <th>数量</th>
                    <th v-if="operateUser.identity === 'boss'">价格</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(specificMsg, msgIndex) in purchaseMsg.productPurchaseSpecificationMsg" :key="msgIndex">
                    <td>{{specificMsg.productPurchaseId}}</td>
                    <td v-if="operateUser.identity === 'boss'">{{specificMsg.productPurchaseCost}}</td>
                    <td>{{specificMsg.productPurchaseNum}}</td>
                    <td v-if="operateUser.identity === 'boss'">{{specificMsg.productPurchaseCost * specificMsg.productPurchaseNum}}</td>
                  </tr>
                </tbody>
              </table>
            </td>
            <td>{{countTotalPriceNum(purchaseMsg.productPurchaseSpecificationMsg).num}}</td>
            <td>{{purchaseMsg.belongStore}}</td>
            <td v-if="operateUser.identity === 'boss'">{{countTotalPriceNum(purchaseMsg.productPurchaseSpecificationMsg).sum}}</td>
            <td>{{purchaseMsg.productPurchaseFreight}}</td>
            <td>{{purchaseMsg.productPurchaseShortage === 'false'? '无' : purchaseMsg.productPurchaseShortage}}</td>
            <td style="color: red;">{{purchaseMsg.productPurchaseSpecificAttention === 'false'? '' : purchaseMsg.productPurchaseSpecificAttention}}</td>
            <td>{{purchaseMsg.productPurchaseExplain}}</td>
            <td>{{purchaseMsg.operateUser}}</td>
            <td>{{purchaseMsg.meta.createAt}}</td>
            <td>{{purchaseMsg.meta.updateAt | countDateChinese}}</td>
            <td>
              <button @click="operatePurchaseMsg('update', purchaseMsg)">修改</button>
              <button @click="operatePurchaseMsg('delete', purchaseMsg)">删除</button>
              <button @click="operatePurchaseMsg('admin_delete', purchaseMsg)">管理员删除</button>
            </td>
          </tr>
          <tr>{{totalPrice}}</tr>
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
  name: 'purchases-list',
  data () {
    return {
      msg: '进货记录列表界面',
      goodsPurchasesList: [], // 商品到货信息数组
      searchData: {
        inputCondition: '', // 搜索数据（厂商、商品名）
        productPurchaseDate: '', // 商品到货日期筛选
        exist: true // 是否存在
      },
      operateUser: this.$jsfn.determineUserLoginSuccess(), // 操作用户
      searchOneItemData: [], // 某一筛选项（日期、厂商、商品名）在目前情况下数据库中的值
      DBIdArray: [], // 到货信息_id数组(用户操作)
      allIdArray: [], // 目前所有到货信息_id数组（后台获取）
      allItem: false, // 全选按钮
      totalPrice: 0 // 目前总价格
    }
  },
  created () {
    var vm = this
    vm.getDataList()
    vm.getPurchaseItemBySearch('productPurchaseDate')
  },
  methods: {
    /*
    * 获取函数
    * */
    // 获取数据列表函数
    getDataList () {
      // 请求数据（查询到数据库中exist=true的到货信息的所有信息boss身份用）
      this.$sendRequest.RTSGet('/rm_purchases/complete_purchases', {userId: '用户id'}).then(res => {
        // console.log('请求到到货信息全部数据')
        if (res.data.code === 0) {
          // console.log('查询成功')
          console.log(res)
          this.goodsPurchasesList = res.data.data
          this.goodsPurchasesList.forEach(e => { // 顺便得到所有的_id数组
            this.allIdArray.push(e._id)
          })
        } else if (res.data.code === 1) {
          // console.log('查询出错')
          this.$windowFn.allWindow('PurchasesList', 'remind', res.data.msg + '刷新一下试试', {agree: '晓得了', cancel: ''}) // 调用提示弹窗
        }
      })
    },

    // 获取某一筛选项目前所有的值（到货时间、厂商、商品名）
    getPurchaseItemBySearch (searchItem) {
      console.log('获取目前所有固定筛选项的值')
      this.$sendRequest.RTSPost('/rm_purchases/find_allTime', {userId: this.userId, searchData: this.searchData, searchItem: searchItem}).then(res => {
        // console.log('请求到目前所有到货时间')
        if (res.data.code === 0) {
          // console.log('查询成功')
          this.searchOneItemData = res.data.data
          console.log(res)
        } else if (res.data.code === 1) {
          // console.log('查询出错')
          this.$windowFn.allWindow('PurchasesList', 'remind', res.data.msg + '刷新一下试试', {agree: '晓得了', cancel: ''}) // 调用提示弹窗
        }
      })
    },

    // 获取商品到货数据通过筛选条件
    getPurchasesDataBySearchData () {
      console.log('获取商品到货数据通过筛选条件')
      this.$sendRequest.RTSPost('/rm_purchases/purchases_by_searchData', {userId: this.userId, searchData: this.searchData}).then(res => {
        // console.log('根据筛选条件请求到货全部数据')
        if (res.data.code === 0) {
          console.log('查询成功')
          console.log(res)
          this.goodsPurchasesList = res.data.data
          this.goodsPurchasesList.forEach(e => { // 顺便得到所有的_id数组
            this.allIdArray.push(e._id)
          })
        } else if (res.data.code === 1) {
          // console.log('查询出错')
          this.$windowFn.allWindow('PurchasesList', 'remind', res.data.msg + '刷新一下试试', {agree: '晓得了', cancel: ''}) // 调用提示弹窗
        }
      })
    },
    /*
    * 本页函数
    * */
    /* -------------共用函数-------------- */

    /* -------------函数------------------ */

    // 到货信息商品总价、总数计算
    countTotalPriceNum (arrayValue) {
      // console.log('计算总价')
      var sum = 0
      var num = 0
      arrayValue.forEach(e => {
        sum += e.productPurchaseNum * e.productPurchaseCost
        num += Number(e.productPurchaseNum)
      })
      console.log('abc')
      return {num, sum}
    },

    // 操作（删除、修改）到货信息函数
    operatePurchaseMsg (operate, purchaseMsg) {
      var vm = this
      const markedWords = function (data) { // 内部公用请求回调
        if (data.data.code === 0) {
          // console.log('删除成功')
          vm.getDataList() // 调用获取数据（到货信息）列表函数
        } else if (data.data.code === 1) {
          // console.log('删除失败')
          this.$windowFn.allWindow('PurchasesList', 'remind', data.data.msg + '刷新一下试试', {agree: '晓得了', cancel: ''}) // 调用弹窗提示重试
        }
      }
      if (operate === 'delete') {
        console.log('（普通用户）删除操作，假删除，将exist置为false')
        this.$windowFn.allWindow(
          'PurchasesList',
          'warning',
          '您确定删除' + purchaseMsg.productPurchaseName + '到货信息吗？10天内可恢复',
          {agree: '确定', cancel: '取消'},
          true
        ).then(res => { // 调用警告弹窗
          if (res.code === 0) {
            this.$sendRequest.RTSPost('/rm_purchases/update_purchases_shamDelete',
              {
                userId: '用户Id',
                _id: purchaseMsg._id
              }).then(markedWords)
          }
        })
      } else if (operate === 'update') {
        console.log('修改操作')
        this.$router.push({name: 'AddNewPurchaseMsg', query: {_id: purchaseMsg._id}, params: {userId: '用户Id'}}) // 跳页修改
      } else if (operate === 'admin_delete') {
        console.log('管理员删除')
        this.$windowFn.allWindow(
          'PurchasesList',
          'warning',
          '用户名作为管理员：您确定删除（' + purchaseMsg.productPurchaseName + '）的到货信息吗？',
          {agree: '确定', cancel: '取消'},
          true
        ).then(res => { // 调用警告弹窗
          if (res.code === 0) {
            this.$sendRequest.RTSDelete('/rm_purchases/delete_purchases', {
              userId: '用户Id',
              purchases_id: purchaseMsg._id
            }).then(markedWords)
          }
        })
      }
    },

    /*
    * 到货信息筛选
    * */
    // （到货筛选）通过searchData获取到货数据
    getPurchasesBySearchData () {
      var vm = this
      console.log(vm.searchData)
      this.$sendRequest.RTSPost('/rm_purchases/purchases_by_searchData', {userId: '获取用户Id', searchData: this.searchData}).then(res => {
        if (res.data.code === 0) {
          vm.goodsPurchasesList = res.data.data
          console.log(this.goodsPurchasesList)
        }
      })
    },

    // 切换到货信息展示列表（查看 已删除 vs 未删除）
    switchoverProductList (value) {
      console.log('切换到货信息展示列表（查看 已删除 vs 未删除）')
      this.searchData.exist = value // 只需要更新存在参数即可
      this.getPurchasesBySearchData() // 获取到货信息通过搜索数据
    },

    /*
    *‘购物车’功能
    * */
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

    // 全选操作
    checkAll (event) {
      // console.log('全选操作', event.target.checked)
      if (event.target.checked) { // 全选
        this.DBIdArray = this.allIdArray.concat() // 直接拷贝所有_id数组
      } else {
        this.DBIdArray = [] // 制空（全不选）
      }
    },

    // 批量删除
    batchDelete () {
      console.log('批量删除', this.DBIdArray)
      this.$sendRequest.RTSDelete('/rm_purchases/delete_purchases_batch', {userId: this.userId, idArray: this.DBIdArray}).then(res => {
        if (res.data.code === 0) {
          console.log('批量删除成功')
          console.log('成功删除' + res.data.data.n + '条数据') // -------------------------------------提示语句要写成【从屏幕下弹出、暗框提示语句】就不用公用弹窗了
        } else if (res.data.code === 1) {
          console.log('批量删除出错')
          this.$windowFn.allWindow('PurchasesList', 'remind', res.data.msg + '刷新一下试试', {agree: '晓得了', cancel: ''}) // 调用提示弹窗
        }
      })
    },

    // 反选
    invertSelection () {
      console.log('反选')
      var idArray = this.DBIdArray.concat()
      this.DBIdArray = [] // 先清空一下原值
      this.goodsPurchasesList.forEach(e => { // 将目前列表数据中的_id push进到货信息_id数组中
        if (idArray.indexOf(e._id) === -1) {
          this.DBIdArray.push(e._id)
        }
      })
    },

    /*
    * 笔记
    * */
    abcD (event) {
      console.log(event)
    }
  }
}
</script>

<style scoped>

</style>
