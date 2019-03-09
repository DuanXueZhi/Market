<!-- 添加新的进货记录 创建于2019/01/08 -->
<template>
  <div id="AddNewPurchaseMsg">
    <p class="AppAllExplain">{{msg}}</p>
    <!--数据写法-->
    <h3>{{purchase_id === 'add'? '到货添加' : '修改' + purchase_id + '到货信息'}}</h3>
    <h4><span style="color: #6e06f3;">{{$jsfn.determineUserLoginSuccess().identity === 'assistant' ? $jsfn.determineUserLoginSuccess().myBoss : $jsfn.determineUserLoginSuccess().userName}}</span>商店</h4>
    <div style="text-align: center; position: relative;" v-if="purchase_id === 'add'">
      <p>{{productPurchaseDate}}，今日到货</p>
      <p>厂商<span style="color: red;" v-if="!productPurchaseName">*</span>：</p>
      <input type="text" v-model="productPurchaseSeller" v-on:input="inputFunction('purchaseSeller')"><span style="color: red;" v-if="mustFilled === 'productPurchaseSeller'">此项必填</span>
      <div style="position: relative;" @click="showProductNameList">
        <p id="productName">商品名<span style="color: red;" v-if="!productPurchaseName">*</span>：</p>
        <input type="text" v-model="productPurchaseName"
               v-on:input="inputFunction('purchaseName')"
               @focus="showProductNameList; mustFilled = 'false'"
               @blur="nameMsgHintList.show = false"
        ><span style="color: red;" v-if="mustFilled === 'productPurchaseName'">此项必填</span>
        <div v-if="nameMsgHintList.show" style="position: absolute; left: 625px; top: 40px; width: 173px;"> <!-- 信息提示菜单 -->
          <ul style="background: #a71d5d; color: #fff;">
            <li style="border-top: 1px solid slateblue;"
                v-bind:class="{optionListActive: productPurchaseName === item._id || nameMsgHintList.forecastOption === item._id}"
                v-on:mouseenter="nameMsgHintList.forecastOption = item._id"
                v-on:mouseleave="nameMsgHintList.forecastOption = false"
                v-for="(item, index) in msgHintListData"
                :key="index"
                @click="productPurchaseName = item._id"
              ><span style="word-wrap: break-word;">{{item._id}}</span>
            </li> <!-- word-wrap:break-word; 强制换行，防止一个单词不换行 -->
          </ul>
        </div>
      </div>
      <div>
        <p id="productPurchaseSpecificationMsg">本次到货信息<span style="color: red;" v-if="productPurchaseSpecificationMsg.length === 0 || productPurchaseSpecificationMsg[0].productPurchaseId === ''">*</span>：</p><span style="color: red;" v-if="mustFilled === 'productPurchaseSpecificationMsg'">此项必填</span>
        <div v-for="(item, index) in productPurchaseSpecificationMsg" :key="index">
          <span>货号{{index + 1}}：</span>
          <select v-on:focus="acquireProductId" v-model="item.productPurchaseId" v-on:change="boundChargePrice(index, item.productPurchaseId)">
            <!-- 'productPurchaseSpecificationMsg.filter(function(e) {return e.productPurchaseId === item._id}).length !== 0' filter返回数组中productPurchaseId === 现在项，的新数组，之后判断是否为空，然后决定是否可以选择 -->
            <option
              :value="goods.productId"
              v-for="(goods, goodsIndex) in goodsListDB"
              :key="goodsIndex"
              :disabled="productPurchaseSpecificationMsg.filter(function(e) {return e.productPurchaseId === goods.productId}).length !== 0"
            >{{goods.productId}}</option>
          </select>
          <span>数量：</span>
          <input type="number" v-model="item.productPurchaseNum">
          <span>进价：</span>
          <input type="number" v-model="item.productPurchaseCost" v-on:input="contrastChargePrice(index, item.productPurchaseId, item.productPurchaseCost)">
          <span style="color: #ec09ec;" v-if="item.priceDiffer && item.priceDiffer !== 0">价格浮动为：<span style="color: red;">{{item.priceDiffer}}</span>；</span>
          <span>{{item.productPurchaseId}}总价：</span>
          <span>{{item.productPurchaseNum * item.productPurchaseCost}}</span>
          <span @click="deleteSpecifications(index)"><i class="iconfont icon-jianshao" style="color: red; margin-left: 10px; cursor: pointer;"></i></span>
        </div>
        <span @click="addSpecifications"><i class="iconfont icon-tianjia" style="font-size: 22px; cursor: pointer;"></i></span>
        <p>本次总数：{{countTotalPrice(productPurchaseSpecificationMsg).num}}件</p>
        <p>本次总进价：{{countTotalPrice(productPurchaseSpecificationMsg).sum}}元</p>
      </div>
      <p>运费：</p>
      <input type="number" v-model="productPurchaseFreight">
      <p>是否缺少：</p>
      <input type="text" v-model="productPurchaseShortage" placeholder="productPurchaseShortage">
      <p style="color: red;">特别注意：</p>
      <input type="text" style="color: red;" v-model="productPurchaseSpecificAttention">
      <p>备注：</p>
      <input type="text" v-model="productPurchaseExplain">
      <div>
        <button @click="submitPurchaseData">提交到货信息</button>
      </div>
    </div>
    <hr>
    <!--修改到货信息-->
    <div style="text-align: center; position: relative; float: left;" v-if="purchase_id !== 'add'">
      <p>{{originalPurchaseData.productPurchaseDate}}，修改该到货信息</p>
      <p>厂商：</p>
      <input type="text" v-model="originalPurchaseData.productPurchaseSeller" disabled>
      <p>商品名：</p>
      <input type="text" v-model="originalPurchaseData.productPurchaseName" disabled>
      <div>
        <p>本次到货信息：</p>
        <div v-for="(item, index) in originalPurchaseData.productPurchaseSpecificationMsg" :key="index">
          <span>货号{{index + 1}}：</span>
          <span>{{item.productPurchaseId}}</span>
          <span>数量：</span>
          <input type="number" v-model="item.productPurchaseNum" disabled><br>
          <span>进价：</span>
          <input type="number" v-model="item.productPurchaseCost" disabled><br>
          <span style="color: #ec09ec;" v-if="item.priceDiffer && item.priceDiffer !== 0">价格浮动为：<span style="color: red;">{{item.priceDiffer}}</span>；</span>
          <span>{{item.productPurchaseId}}总价：</span>
          <span>{{item.productPurchaseNum * item.productPurchaseCost}}</span>
        </div>
        <p>本次总数：{{countTotalPrice(originalPurchaseData.productPurchaseSpecificationMsg).num}}件</p>
        <p>本次总进价：{{countTotalPrice(originalPurchaseData.productPurchaseSpecificationMsg).sum}}元</p>
      </div>
      <p>运费：</p>
      <input type="number" v-model="originalPurchaseData.productPurchaseFreight" disabled>
      <p>是否缺少：</p>
      <input type="text" v-model="originalPurchaseData.productPurchaseShortage" placeholder="productPurchaseShortage" disabled>
      <p style="color: red;">特别注意：</p>
      <input type="text" style="color: red;" v-model="originalPurchaseData.productPurchaseSpecificAttention" disabled>
      <p>备注：</p>
      <input type="text" v-model="originalPurchaseData.productPurchaseExplain" disabled>
    </div>
    <div style="text-align: center; position: relative;" v-if="purchase_id !== 'add'">
      <p>{{productPurchaseDate}}，修改到货信息</p>
      <p>厂商：</p>
      <input type="text" v-model="productPurchaseSeller" v-on:input="inputFunction('purchaseSeller')">
      <div style="position: relative;" @click="showProductNameList">
        <p id="productName">商品名<span style="color: red;" v-if="!productPurchaseName">*</span>：</p>
        <input type="text" v-model="productPurchaseName"
               v-on:input="inputFunction('purchaseName')"
               v-on:focus="showProductNameList; mustFilled = 'false'"
        ><span style="color: red;" v-if="mustFilled === 'name'">此项必填</span>
        <div v-if="nameMsgHintList.show" style="position: absolute; left: 1032px; top: 40px; width: 173px;"> <!-- 信息提示菜单 -->
          <ul style="background: #a71d5d; color: #fff;">
            <li style="border-top: 1px solid slateblue;"
                v-bind:class="{optionListActive: productPurchaseName === item._id || nameMsgHintList.forecastOption === item._id}"
                v-on:mouseenter="nameMsgHintList.forecastOption = item._id"
                v-on:mouseleave="nameMsgHintList.forecastOption = false"
                v-for="(item, index) in msgHintListData"
                :key="index"
                @click="productPurchaseName = item._id"
            ><span style="word-wrap: break-word;">{{item._id}}</span
            ></li> <!-- word-wrap:break-word; 强制换行，防止一个单词不换行 -->
          </ul>
        </div>
      </div>
      <div>
        <p id="updateProductPurchaseSpecificationMsg">本次到货信息<span style="color: red;" v-if="productPurchaseSpecificationMsg.length === 0 || productPurchaseSpecificationMsg[0].productPurchaseId === ''">*</span>：</p><span style="color: red;" v-if="mustFilled === 'updateProductPurchaseSpecificationMsg'">此项必填</span>
        <div v-for="(item, index) in productPurchaseSpecificationMsg" :key="index">
          <span>货号{{index + 1}}：</span>
          <select v-on:focus="acquireProductId" v-model="item.productPurchaseId" v-on:change="boundChargePrice(index, item.productPurchaseId)">
            <!-- 'productPurchaseSpecificationMsg.filter(function(e) {return e.productPurchaseId === item._id}).length !== 0' filter返回数组中productPurchaseId === 现在项，的新数组，之后判断是否为空，然后决定是否可以选择 -->
            <option
              :value="goods.productId"
              v-for="(goods, goodsIndex) in goodsListDB"
              :key="goodsIndex"
              :disabled="productPurchaseSpecificationMsg.filter(function(e) {return e.productPurchaseId === goods.productId}).length !== 0"
            >{{goods.productId}}</option>
          </select>
          <span>数量：</span>
          <input type="number" v-model="item.productPurchaseNum">
          <span>进价：</span>
          <input type="number" v-model="item.productPurchaseCost" v-on:input="contrastChargePrice(index, item.productPurchaseId, item.productPurchaseCost)">
          <span style="color: #ec09ec;" v-if="item.priceDiffer && item.priceDiffer !== 0">价格浮动为：<span style="color: red;">{{item.priceDiffer}}</span>；</span>
          <span>{{item.productPurchaseId}}总价：</span>
          <span>{{item.productPurchaseNum * item.productPurchaseCost}}</span>
          <span @click="deleteSpecifications(index)"><i class="iconfont icon-jianshao" style="color: red; margin-left: 10px; cursor: pointer;"></i></span>
        </div>
        <span @click="addSpecifications"><i class="iconfont icon-tianjia" style="font-size: 22px; cursor: pointer;"></i></span>
        <p>本次总数：{{countTotalPrice(productPurchaseSpecificationMsg).num}}件</p>
        <p>本次总进价：{{countTotalPrice(productPurchaseSpecificationMsg).sum}}元</p>
      </div>
      <p>运费：</p>
      <input type="number" v-model="productPurchaseFreight">
      <p>是否缺少：</p>
      <input type="text" v-model="productPurchaseShortage" placeholder="productPurchaseShortage">
      <p style="color: red;">特别注意：</p>
      <input type="text" style="color: red;" v-model="productPurchaseSpecificAttention">
      <p>备注：</p>
      <input type="text" v-model="productPurchaseExplain">
      <div>
        <button @click="submitUpdateData">提交修改</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'add-new-purchase-msg',
  data () {
    return {
      msg: '添加新的进货记录界面',
      // ----------------------------------------------商品进货数据---------------------------------------------- 封装 productPurchaseData
      productPurchaseDate: new Date(), // 商品进货日期
      productPurchaseSeller: '', // 商品进货厂商
      productPurchaseName: '', // 商品进货名
      productPurchaseSpecificationMsg: [ // 商品进货规格信息（商品id + 数量 + 进价 + 差价【 + 图片】）
        {productPurchaseId: '', productPurchaseNum: 0, productPurchaseCost: 0, priceDiffer: 0}
      ],
      productPurchaseFreight: 0, // 商品运费
      productPurchaseShortage: false, // 商品是否缺少
      productPurchaseSpecificAttention: false, // 特别注意
      productPurchaseExplain: '暂无', // 进货商品备注
      // ----------------------------------------------本页数据----------------------------------------------
      msgHintListData: '', // 信息提示菜单数据 【数据变量共用但数据不共用，便可省略为一个请求函数】
      nameMsgHintList: { // 信息提示菜单
        show: false, // 展示
        data: '', // 数据
        top: 0, // 菜单上定位
        left: 0, // 菜单左定位
        width: 0, // 菜单宽度
        forecastOption: false, // 预备选项
        alreadyOption: '' // 已选项
      },
      mustFilled: false, // 必填项未填
      goodsListDB: [], // 数据库中商品信息[用于已知商品名获取数据库中该商品名下所有数据]
      originalPurchaseData: { // 原到货信息数据【由数据id获得】
        productPurchaseSeller: '', // 商品进货厂商
        productPurchaseName: '', // 商品进货名
        productPurchaseSpecificationMsg: [ // 商品进货规格信息（商品id + 数量 + 进价 + 差价【 + 图片】）
          {productPurchaseId: '', productPurchaseNum: 0, productPurchaseCost: 0, priceDiffer: 0}
        ],
        productPurchaseFreight: 0, // 商品运费
        productPurchaseShortage: false, // 商品是否缺少
        productPurchaseSpecificAttention: false, // 特别注意
        productPurchaseExplain: '暂无' // 进货商品备注
      },
      searchData: {
        _id: ''
      },
      purchase_id: 'add', // 到货信息_id
      updateData: { // 修改商品信息
        productPurchaseSeller: '', // 商品进货厂商
        productPurchaseName: '', // 商品进货名
        productPurchaseSpecificationMsg: [ // 商品进货规格信息（商品id + 数量 + 进价 + 差价【 + 图片】）
          {productPurchaseId: '', productPurchaseNum: 0, productPurchaseCost: 0, priceDiffer: 0}
        ],
        productPurchaseFreight: 0, // 商品运费
        productPurchaseShortage: false, // 商品是否缺少
        productPurchaseSpecificAttention: false, // 特别注意
        productPurchaseExplain: '暂无' // 进货商品备注
      }
    }
  },
  created () {
    var cvm = this
    this.productPurchaseDate = new Date().getFullYear() + '年' + new Date().getMonth() + 1 + '月' + new Date().getDate() + '日' + new Date().getHours() + ':' + new Date().getMinutes()
    cvm.purchase_id = cvm.$route.query._id
    cvm.searchData._id = cvm.$route.query._id
    cvm.getPurchaseMsgByPurchaseId() // 通过信息Id获取到货信息
  },
  watch: {
    '$route' (to, from) { // 监听路由参数的变化
      // console.log(to, from)
      var wvm = this
      wvm.purchase_id = wvm.$route.query._id // 路由参数_id改变则影响页面显示
    },
    'productPurchaseName' (newData, oldData) {
      console.log('商品名监控')
      this.acquireProductId()
    }
  },
  methods: {
    /* ---------------------------------获取函数--------------------------------- */
    // 模糊获取输入中的商品厂商

    // 首次/输入模糊获取库中的商品厂商/商品名
    getProductNameByInput (inputValue, itemKey) {
      console.log('模糊获取输入中的商品名')
      this.$sendRequest.RTSPost('/rm_goods/find_searchItem', {userId: '用户id', searchData: {productName: {$regex: inputValue}}, searchItem: itemKey}).then(res => { // searchData为空，之后可加上‘厂商’
        if (res.data.code === 0) {
          this.msgHintListData = res.data.data
          console.log(this.msgHintListData)
        } else if (res.data.code === 1) {
          console.log('查询出错')
          this.$windowFn.allWindow('AddNewPurchaseMsg', 'remind', '获取商品名' + res.data.msg + '刷新一下试试', {agree: '确定', cancel: ''}) // 调用提示弹窗
        }
      })
    },

    // 已知商品名获取商品Id，进价
    getProductIdByProductName () {
      console.log('模糊获取输入中的商品名')
      this.$sendRequest.RTSPost('/rm_goods/goods_by_searchData', {userId: '用户id', searchData: {productName: this.productPurchaseName}}).then(res => { // searchData为空，之后可加上‘厂商’
        if (res.data.code === 0) {
          this.goodsListDB = res.data.data
          console.log(this.goodsListDB)
        } else if (res.data.code === 1) {
          console.log('查询出错')
          this.$windowFn.allWindow('AddNewPurchaseMsg', 'remind', '获取商品名' + res.data.msg + '刷新一下试试', {agree: '确定', cancel: ''}) // 调用提示弹窗
        }
      })
    },

    // 通过_id获取商品数据
    getPurchaseMsgByPurchaseId () {
      if (this.purchase_id !== 'add') {
        this.$sendRequest.RTSPost('/rm_purchases/purchases_by_searchData', {userId: '获取用户Id', searchData: this.searchData}).then(res => {
          if (res.data.code === 0) {
            this.originalPurchaseData = res.data.data
            console.log(this.originalPurchaseData)
          }
        })
      } else {
        console.log('商品添加，不需要获取原商品数据')
      }
    },

    // 获取商品厂商下所有商品名

    /* -----------------------------------------公用函数---------------------------------------- */
    // 锚点跳转
    goAnchor (selector) {
      this.$el.querySelector(selector).scrollIntoView() // querySelector：css选择器，scrollIntoView：页面滚动参数默认true（顶部），false页面滚动到底部
    },

    // 判空函数并展示
    emptyShow () {
      var location = '' // 空值位置
      if (this.productPurchaseSeller === '') {
        location = 'productPurchaseSeller'
      } else if (this.productPurchaseName === '') {
        location = 'productPurchaseName'
      } else if (this.productPurchaseSpecificationMsg.length === 0 || this.productPurchaseSpecificationMsg[0].productPurchaseId === '') {
        location = 'productPurchaseSpecificationMsg'
      } else {
        return true
      }
      this.mustFilled = location
      this.goAnchor(location)
    },

    // 总价、总数计算
    countTotalPrice (arrayValue) {
      console.log('计算总价')
      var sum = 0
      var num = 0
      arrayValue.forEach(e => {
        sum += e.productPurchaseNum * e.productPurchaseCost
        num += Number(e.productPurchaseNum)
      })
      return {num, sum}
    },

    // 封装商品进货信息
    productPurchaseMsgBox () {
      console.log('封装到productPurchaseData对象')
      return {
        productPurchaseSeller: this.productPurchaseSeller, // 商品进货厂商
        productPurchaseName: this.productPurchaseName, // 商品进货名
        productPurchaseSpecificationMsg: this.productPurchaseSpecificationMsg, // 商品进货规格信息（商品id + 数量 + 进价 + 差价【 + 图片】）
        belongStore: this.$jsfn.determineUserLoginSuccess().identity === 'assistant' ? this.$jsfn.determineUserLoginSuccess().myBoss : this.$jsfn.determineUserLoginSuccess().userName, // 信息所属店铺
        productPurchaseFreight: this.productPurchaseFreight, // 商品运费
        productPurchaseShortage: this.productPurchaseShortage, // 商品是否缺少
        productPurchaseSpecificAttention: this.productPurchaseSpecificAttention, // 特别注意
        productPurchaseExplain: this.productPurchaseExplain, // 进货商品备注
        operateUser: this.$jsfn.determineUserLoginSuccess().userName // 该信息的操作者
      }
    },

    // 输入获取函数
    inputFunction (value) {
      console.log('输入获取函数', value)
      if (value === 'purchaseSeller') { // 商品进货商家 // 连接到获取商家接口

      } else if (value === 'purchaseName') { // 进货商品名 // 连接到获取该商品名下所有商品id接口
        console.log('调用通过输入值模糊检索商品名')
        this.getProductNameByInput(this.productPurchaseName, 'productName') // 调用通过输入值模糊检索商品名
      }
    },

    // 展示商品名列表函数
    showProductNameList () {
      console.log('展示商品名列表函数')
      this.nameMsgHintList.show = true
      this.getProductNameByInput(this.productPurchaseName, 'productName')
    },

    // 商品名输入完成，获取数据库中该商品名下的所有商品id
    acquireProductId () {
      if (this.productPurchaseName === '') {
        console.log('进货商品名未输入')
        this.mustFilled = 'name' // 展示相应位置信息
        this.goAnchor('#productName') // 锚点定位到商品进货名称
      } else {
        console.log('进货商品名已输入')
        this.getProductIdByProductName(this.productPurchaseName) // 调用模糊查询商品名函数
      }
    },

    // 添加规格({商品Id:'', 数量:'', 成本:''})
    addSpecifications () {
      // console.log('添加一个规格输入框')
      this.productPurchaseSpecificationMsg.push({productPurchaseId: '', productPurchaseNum: 0, productPurchaseCost: 0})
    },

    // 删除规格
    deleteSpecifications (ruleIndex) {
      // console.log('删除第' + ruleIndex + '个规格输入框')
      this.productPurchaseSpecificationMsg.splice(ruleIndex, 1)
    },

    // 提交进货数据
    submitPurchaseData () {
      console.log('提交进货数据')
      if (this.emptyShow()) {
        var productPurchaseData = this.productPurchaseMsgBox()
        this.$sendRequest.RTSPost('/rm_purchases/add_purchases', productPurchaseData).then(res => {
          if (res.data.code === 0) {
            // console.log('提交成功');
            this.$windowFn.allWindow( // 触发弹窗函数以提醒用户
              'AddNewPurchaseMsg',
              'congratulations',
              {
                text: '已成功添加' + this.productPurchaseName + '到货信息'
              },
              {agree: '查看今日到货信息', cancel: '继续添加'},
              true
            ).then(e => {
              if (e.code === 0) {
                console.log('查看今日到货信息')
                this.$router.push({name: 'PurchasesList'}) // 转到商品展示列表GoodsList.vue
              } else if (e.code === 1) {
                console.log('继续添加')
                // 清空页面值
                this.productPurchaseDate = new Date() // 商品进货日期
                this.productPurchaseSeller = '' // 商品进货厂商
                this.productPurchaseName = '' // 商品进货名
                this.productPurchaseSpecificationMsg = [] // 商品进货规格信息（商品id + 数量 + 进价 + 差价【 + 图片】）
                this.productPurchaseFreight = 0 // 商品运费
                this.productPurchaseShortage = false // 商品是否缺少
                this.productPurchaseSpecificAttention = false // 特别注意
                this.productPurchaseExplain = '暂无' // 进货商品备注
              }
            })
          } else {
            console.log('提交失败')
          }
        })
      }
    },

    // 根据商品id将数据库中进价绑定到productPurchaseCost
    boundChargePrice (inputIndex, productId) { // inputIndex：商品规格的第几个，productId：商品id的
      console.log('显示数据库中进价', inputIndex, productId)
      this.goodsListDB.filter(e => {
        if (e.productId === productId) {
          this.productPurchaseSpecificationMsg[inputIndex].productPurchaseCost = e.productOriginalPrice
        }
      })
    },

    // 通过商品id获取商品数据库中的进价
    productChargePriceByProductId (productId) {
      console.log('通过商品id获取商品数据库中的进价', 'productId: ', productId, this.goodsListDB)
      if (this.goodsListDB.length !== 0 && productId !== '') {
        var productMsg = this.goodsListDB.filter(e => {
          return e.productId === productId
        })
        return productMsg[0].productOriginalPrice
      }
    },

    // 比较两次进价
    contrastChargePrice (inputIndex, productId, nowCost) {
      console.log('比较两次进价')
      this.productPurchaseSpecificationMsg[inputIndex].priceDiffer = nowCost - this.productChargePriceByProductId(productId)
    },

    // 提交修改商品
    submitUpdateData () {
      console.log('提交修改商品')
      if (this.productPurchaseSpecificationMsg.length === 0 || this.productPurchaseSpecificationMsg[0].productPurchaseId === '') {
        console.log('进货信息为空')
        this.mustFilled = 'updateProductPurchaseSpecificationMsg'
        this.goAnchor('#updateProductPurchaseSpecificationMsg')
      } else {
        this.updateData = this.productPurchaseMsgBox()
        console.log(this.updateData)
        this.$sendRequest.RTSPost('/rm_purchases/update_purchases', {updateData: this.updateData, _id: this.searchData._id, userId: this.userId}).then(res => {
          if (res.data.code === 0) {
            // console.log('提交成功');
            this.$windowFn.allWindow( // 触发弹窗函数以提醒用户
              'AddNewPurchaseMsg',
              'congratulations',
              {
                text: '已成功修改' + this.productPurchaseName + '到货信息'
              },
              {agree: '查看到货信息', cancel: '继续修改'},
              true
            ).then(e => {
              if (e.code === 0) {
                console.log('查看今日到货信息')
                this.$router.push({name: 'PurchasesList'}) // 转到商品展示列表GoodsList.vue
              } else if (e.code === 1) {
                console.log('继续修改')
                // 清空页面值
                this.productPurchaseDate = new Date() // 商品进货日期
                this.productPurchaseSeller = '' // 商品进货厂商
                this.productPurchaseName = '' // 商品进货名
                this.productPurchaseSpecificationMsg = [] // 商品进货规格信息（商品id + 数量 + 进价 + 差价【 + 图片】）
                this.productPurchaseFreight = 0 // 商品运费
                this.productPurchaseShortage = false // 商品是否缺少
                this.productPurchaseSpecificAttention = false // 特别注意
                this.productPurchaseExplain = '暂无' // 进货商品备注
              }
            })
          } else {
            console.log('提交失败')
          }
        })
      }
    }
    /*
    * 笔记
    * */
    // this.msgHintList.show = true // 展示提示菜单
    // this.msgHintList.top = event.target.offsetTop + event.target.offsetHeight // 距离屏幕左上角的高度 + 元素高度
    // this.msgHintList.left = event.target.offsetLeft // 距离屏幕左上角的左侧距离
    // this.msgHintList.width = event.target.offsetWidth // 元素宽度
    // test () {
    //   console.log('ABC-test')
    // }
  }
}
</script>

<style scoped lang="less">
  .optionListActive{ /* 选项菜单单项活跃状态 */
    background: #0086b3;
    color: #e4af91;
  }
</style>
