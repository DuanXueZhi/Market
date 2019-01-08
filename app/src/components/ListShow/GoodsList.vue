<template>
    <div id="GoodsList">
      <p class="AppAllExplain">{{msg}}</p>
      <!--数据写法-->
      <div>
        <!--搜索-->
        <div style="text-align: center; padding: 30px;">
          <input style="padding: 5px; font-size: 18px; width: 500px;" type="text" placeholder="按商品名或商品码或品名全拼或首拼或分类搜索......" v-model="searchData.inputCondition" @keyup.enter="getProductBySearchData"
          ><button @click="getProductBySearchData">确定</button>
        </div>
        <div style="float: right; margin-right: 20px;">
          <button @click="switchoverProductList(false)" v-bind="{disabled: !searchData.exist}">回收站</button>
        </div>
        <div style="float: right; margin-right: 20px;">
          <button @click="switchoverProductList(true)" v-bind="{disabled: searchData.exist}">商品列表</button>
        </div>
        <!--商品列表-->
        <table>
          <thead>
            <tr style="border: 1px solid firebrick;">
              <th style="width: 40px;">序号</th>
              <th style="width: 200px; border-left: 1px solid red;">图片</th>
              <th style="width: 60px; border-left: 1px solid red; position: relative; cursor: pointer;"
                  v-bind:class="{headerSearchActive: searchData.productName !== ''}"
                  @click="headerOneSearchShow('productName')">
                <p>商品名v<span style="color: #c3c3a0;" v-if="searchData.productName !== ''">：{{searchData.productName}}</span></p>
                <ul style="position: absolute; left: -1px; top: 22px; background: #a71d5d; color: #fff; width: 62px;" v-if="headerItemShow === 'productName'">
                  <li style="border-top: 1px solid slateblue;"
                      v-bind:class="{optionListActive: searchData.productName === '' || forecastOption === ''}"
                      v-on:mouseenter="forecastOption = ''"
                      v-on:mouseleave="forecastOption = false"
                      @click="choseSearchItem('productName', '')"
                    ><span>全部</span
                  ></li
                  ><li style="border-top: 1px solid slateblue;"
                      v-bind:class="{optionListActive: searchData.productName === item._id || forecastOption === item._id}"
                      v-on:mouseenter="forecastOption = item._id"
                      v-on:mouseleave="forecastOption = false"
                      v-for="(item, index) in productHeaderData"
                      :key="index"
                      @click="choseSearchItem('productName', item._id)"
                    ><span style="word-wrap: break-word;">{{item._id}}</span
                  ></li> <!-- word-wrap:break-word; 强制换行，防止一个单词不换行 -->
                </ul>
              </th>
              <th style="width: 50px; border-left: 1px solid red;">商品码</th>
              <!--<th style="width: 60px; border-left: 1px solid red;">品名+id</th>-->
              <th style="width: 50px; border-left: 1px solid red; position: relative; cursor: pointer;"
                  v-bind:class="{headerSearchActive: searchData.productSeller !== ''}"
                  @click="headerOneSearchShow('productSeller')">
                <p>厂商v<span style="color: #c3c3a0;" v-if="searchData.productSeller !== ''">：{{searchData.productSeller}}</span></p>
                <ul style="position: absolute; left: -1px; top: 22px; background: #a71d5d; color: #fff; width: 62px;" v-if="headerItemShow === 'productSeller'">
                  <li style="border-top: 1px solid slateblue;"
                      v-bind:class="{optionListActive: searchData.productSeller === '' || forecastOption === ''}"
                      v-on:mouseenter="forecastOption = ''"
                      v-on:mouseleave="forecastOption = false"
                      @click="choseSearchItem('productSeller', '')"
                    ><span>全部</span
                  ></li
                  ><li style="border-top: 1px solid slateblue;"
                       v-bind:class="{optionListActive: searchData.productSeller === item._id || forecastOption === item._id}"
                       v-on:mouseenter="forecastOption = item._id"
                       v-on:mouseleave="forecastOption = false"
                       v-for="(item, index) in productHeaderData"
                       :key="index"
                       @click="choseSearchItem('productSeller', item._id)"
                    ><span style="word-wrap: break-word;">{{item._id}}</span
                  ></li> <!-- word-wrap:break-word; 强制换行，防止一个单词不换行 -->
                </ul>
              </th>
              <th style="min-width: 40px; border-left: 1px solid red;">详情</th>
              <th style="width: 50px; border-left: 1px solid red; position: relative; cursor: pointer;"
                  v-bind:class="{headerSearchActive: searchData.productColor !== ''}"
                  @click="headerOneSearchShow('productColor')">
                <p>颜色v<span style="color: #c3c3a0;" v-if="searchData.productColor !== ''">：{{searchData.productColor}}</span></p>
                <ul style="position: absolute; left: -1px; top: 22px; background: #a71d5d; color: #fff; width: 62px;" v-if="headerItemShow === 'productColor'">
                  <li style="border-top: 1px solid slateblue;"
                      v-bind:class="{optionListActive: searchData.productColor === '' || forecastOption === ''}"
                      v-on:mouseenter="forecastOption = ''"
                      v-on:mouseleave="forecastOption = false"
                      @click="choseSearchItem('productColor', '')"
                    ><span>全部</span
                  ></li
                  ><li style="border-top: 1px solid slateblue;"
                       v-bind:class="{optionListActive: searchData.productColor === item._id || forecastOption === item._id}"
                       v-on:mouseenter="forecastOption = item._id"
                       v-on:mouseleave="forecastOption = false"
                       v-for="(item, index) in productHeaderData"
                       :key="index"
                       @click="choseSearchItem('productColor', item._id)"
                    ><span style="word-wrap: break-word;">{{item._id}}</span
                  ></li> <!-- word-wrap:break-word; 强制换行，防止一个单词不换行 -->
                </ul>
              </th>
              <th style="width: 70px; border-left: 1px solid red;">规格</th>
              <th style="width: 50px; border-left: 1px solid red;">总数</th>
              <th style="width: 50px; border-left: 1px solid red; position: relative; cursor: pointer;"
                  v-bind:class="{headerSearchActive: searchData.productGenre !== ''}"
                  @click="headerOneSearchShow('productGenre')">
                <p>分类v<span style="color: #c3c3a0;" v-if="searchData.productGenre !== ''">：{{searchData.productGenre}}</span></p>
                <ul style="position: absolute; left: -1px; top: 22px; background: #a71d5d; color: #fff; width: 62px;" v-if="headerItemShow === 'productGenre'">
                  <li style="border-top: 1px solid slateblue;"
                      v-bind:class="{optionListActive: searchData.productGenre === '' || forecastOption === ''}"
                      v-on:mouseenter="forecastOption = ''"
                      v-on:mouseleave="forecastOption = false"
                      @click="choseSearchItem('productGenre', '')"
                    ><span>全部</span
                  ></li
                  ><li style="border-top: 1px solid slateblue;"
                       v-bind:class="{optionListActive: searchData.productGenre === item._id || forecastOption === item._id}"
                       v-on:mouseenter="forecastOption = item._id"
                       v-on:mouseleave="forecastOption = false"
                       v-for="(item, index) in productHeaderData"
                       :key="index"
                       @click="choseSearchItem('productGenre', item._id)"
                    ><span style="word-wrap: break-word;">{{item._id}}</span
                  ></li> <!-- word-wrap:break-word; 强制换行，防止一个单词不换行 -->
                </ul>
              </th>
              <th style="width: 70px; border-left: 1px solid red;">单品进价</th>
              <th style="width: 80px; border-left: 1px solid red;">单品批发价</th>
              <th style="width: 80px; border-left: 1px solid red;">单品零售价</th>
              <th style="width: 60px; border-left: 1px solid red; position: relative; cursor: pointer;"
                  v-bind:class="{headerSearchActive: searchData.userId !== ''}"
                  @click="headerOneSearchShow('userId')">
                <p>操作者v<span style="color: #c3c3a0;" v-if="searchData.userId !== ''">：{{searchData.userId}}</span></p>
                <ul style="position: absolute; left: -1px; top: 22px; background: #a71d5d; color: #fff; width: 62px;" v-if="headerItemShow === 'userId'">
                  <li style="border-top: 1px solid slateblue;"
                      v-bind:class="{optionListActive: searchData.userId === '' || forecastOption === ''}"
                      v-on:mouseenter="forecastOption = ''"
                      v-on:mouseleave="forecastOption = false"
                      @click="choseSearchItem('userId', '')"
                    ><span>全部</span
                  ></li
                  ><li style="border-top: 1px solid slateblue;"
                       v-bind:class="{optionListActive: searchData.userId === item._id || forecastOption === item._id}"
                       v-on:mouseenter="forecastOption = item._id"
                       v-on:mouseleave="forecastOption = false"
                       v-for="(item, index) in productHeaderData"
                       :key="index"
                       @click="choseSearchItem('userId', item._id)"
                    ><span style="word-wrap: break-word;">{{item._id}}</span
                  ></li> <!-- word-wrap:break-word; 强制换行，防止一个单词不换行 -->
                </ul>
              </th>
              <th style="min-width: 40px; border-left: 1px solid red;">备注</th>
              <th style="border-left: 1px solid red;">创建时间</th>
              <th style="border-left: 1px solid red;">最后修改时间</th>
              <!--<th style="width: 50px;">存在？</th>-->
              <!--<th>_id</th>-->
              <!--<th>首拼</th>-->
              <!--<th>全拼</th>-->
              <!--<th>__v</th>-->
              <th style="border-left: 1px solid red;">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr style="border: 1px solid red;" v-for="(product, index) in goodsList" :key="product._id">
              <td>{{index + 1}}</td>
              <td>
                <div style="width: 100px; height: 100px;display: inline;" v-for="(image, index) in product.productImage" :key="image"
                ><img style="width: 98px; height: 98px; border: 1px solid black;" :src="image" :alt="index"
                ></div>
              </td>
              <td :title="product.productName">{{product.productName | textOmit(5)}}</td>
              <td :title="product.productId">{{product.productId | textOmit(5)}}</td>
              <!--<td>{{product.productNameAddId | textOmit(5)}}</td>-->
              <td>{{product.productSeller}}</td>
              <td :title="product.productDetails">{{product.productDetails | textOmit(10)}}</td>
              <td>{{product.productColor}}</td>
              <td>
                <table>
                  <thead>
                    <tr>
                      <th>尺码</th>
                      <th>数量</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, index) in product.productSpecifications" :key="item.size + index">
                      <td>{{item.size}}</td>
                      <td>{{item.number}}</td>
                    </tr>
                  </tbody>
                </table>
              </td>
              <td>{{addition(product.productSpecifications)}}</td>
              <td>{{product.productGenre}}</td>
              <td>{{product.productOriginalPrice}}</td>
              <td>{{product.productBatchPrice}}</td>
              <td>{{product.productSoloPrice}}</td>
              <td :title="product.userId">{{product.userId | textOmit(5)}}</td>
              <td :title="product.productExplain">{{product.productExplain | textOmit(10)}}</td>
              <td>{{product.meta.createAt}}</td>
              <td>{{product.meta.updateAt | countDateChinese}}</td>
              <!--<td>{{product.exist}}</td>-->
              <!--<td>{{product._id}}</td>-->
              <!--<td>{{product.productNameFirstSpell}}</td>-->
              <!--<td>{{product.productNameFullSpell}}</td>-->
              <!--<td>{{product.__v}}</td>-->
              <td>
                <button @click="operateProduct('update', product)">修改</button>
                <button @click="operateProduct('delete', product)">删除</button>
                <button @click="operateProduct('admin_delete', product)">管理员删除</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
</template>

<script>
export default {
  name: 'goods-list',
  data () {
    return {
      msg: '商品列表界面',
      goodsList: [], // 商品信息数组
      updateSubmit: false, // 修改提交按钮是否可点击
      searchData: { // 商品筛选条件（包括表头筛选项）  [分类、操作者就不需要输入搜索了，点击表头筛选即可，否则输入搜索的结果会有很多无关的数据]
        inputCondition: '', // 搜索框中输入（productId 或 productName 或 productName + productId）的条件
        productName: '',
        productSeller: '',
        productColor: '',
        productGenre: '',
        userId: '',
        exist: true
      },
      productHeaderData: [], // 查询到的商品搜有表头的筛选项
      headerItemShow: false, // 是否展示此表头此时的筛选项菜单
      forecastOption: false // 预选项
    }
  },
  created () {
    var vm = this
    vm.getDataList()
  },
  methods: {
    /*
    * 获取函数
    * */
    // 获取数据列表函数
    getDataList () {
      // 请求数据（查询到数据库中exist=true的商品的所有信息boss身份用）
      this.$sendRequest.RTSGet('/rm_goods/complete_goods', {userId: '用户id'}).then(res => {
        // console.log('请求到商品全部数据')
        if (res.data.code === 0) {
          // console.log('查询成功')
          console.log(res)
          this.goodsList = res.data.data
        } else if (res.data.code === 1) {
          // console.log('查询出错')
          this.$windowFn.allWindow('GoodsList', 'remind', res.data.msg + '刷新一下试试', {agree: '晓得了', cancel: ''}) // 调用提示弹窗
        }
      })
    },

    // 获取商品表头所有筛选项此时的所有值
    getAllProductHeaderSearch (searchItem) {
      console.log('获取商品筛选项的所有数据')
      console.log(this.searchData) // 根据搜索条件得到各筛选条件的项
      this.$sendRequest.RTSPost('/rm_goods/find_searchItem', {userId: '用户id', searchData: this.searchData, searchItem: searchItem}).then(res => {
        if (res.data.code === 0) {
          this.productHeaderData = res.data.data
          console.log('已获取到商品表头所有筛选项此时的所有值', this.productHeaderData)
        } else if (res.data.code === 1) {
          console.log('查询出错')
          this.$windowFn.allWindow('GoodsList', 'remind', '商品所有筛选' + res.data.msg + '刷新一下试试', {agree: '晓得了', cancel: ''}) // 调用提示弹窗
        }
      })
    },
    /*
    * 本页函数
    * */
    /* -------------共用函数-------------- */

    /* -------------函数------------------ */
    // 操作（删除、修改）商品函数
    operateProduct (operate, product) {
      var vm = this
      const markedWords = function (data) { // 内部公用请求回调
        if (data.data.code === 0) {
          // console.log('删除成功')
          vm.getDataList() // 调用获取数据（商品）列表函数
        } else if (data.data.code === 1) {
          // console.log('删除失败')
          this.$windowFn.allWindow('GoodsList', 'remind', data.data.msg + '刷新一下试试', {agree: '晓得了', cancel: ''}) // 调用弹窗提示重试
        }
      }
      if (operate === 'delete') {
        console.log('（普通用户）删除操作，假删除，将exist置为false')
        this.$windowFn.allWindow(
          'GoodsList',
          'warning',
          '您确定删除' + product.productName + product.productId + '商品吗？10天内可恢复',
          {agree: '确定', cancel: '取消'},
          true
        ).then(res => { // 调用警告弹窗
          if (res.code === 0) {
            this.$sendRequest.RTSPost('/rm_goods/update_goods_shamDelete',
              {
                userId: '用户Id',
                _id: product._id
              }).then(markedWords)
          }
        })
      } else if (operate === 'update') {
        console.log('修改操作')
        this.$router.push({name: 'AddNewGoods', query: {_id: product._id}, params: {userId: '用户Id'}}) // 跳页修改
      } else if (operate === 'admin_delete') {
        console.log('管理员删除')
        this.$windowFn.allWindow(
          'GoodsList',
          'warning',
          '用户名作为管理员：您确定删除' + product.productName + product.productId + '商品吗？',
          {agree: '确定', cancel: '取消'},
          true
        ).then(res => { // 调用警告弹窗
          if (res.code === 0) {
            this.$sendRequest.RTSDelete('/rm_goods/delete_goods', {
              userId: '用户Id',
              product_id: product._id
            }).then(markedWords)
          }
        })
      }
    },

    // 商品总数计算
    addition (addendArray) {
      var num = 0
      if (typeof addendArray === 'object') {
        addendArray.forEach(e => {
          if (typeof e.number === 'number') {
            num += e.number
          } else {
            num = '数据错误'
          }
        })
      } else {
        console.log('数据错误')
      }
      return num
    },

    /*
    * 商品筛选
    * */
    // （商品筛选）通过searchData获取商品数据
    getProductBySearchData () {
      var vm = this
      console.log(vm.searchData)
      this.$sendRequest.RTSPost('/rm_goods/goods_by_searchData', {userId: '获取用户Id', searchData: this.searchData}).then(res => {
        if (res.data.code === 0) {
          vm.goodsList = res.data.data
          console.log(this.goodsList)
        }
      })
    },

    // 商品表头单个筛选项获取/并展示
    headerOneSearchShow (headerSearchItem) { // 此处应作阻止冒泡，但不做反而省了选择后将菜单关闭（将this.headerItemShow 置为 false的步骤）也许就是冒泡的真正用意吧【暂不做阻止冒泡。阻止冒泡做法在此函数中阻止冒泡，并在choseSearchItem函数（选择商品表头每个信息的筛选项）中将this.headerItemShow（是否展示此表头的搜有筛选项菜单） 置为 false】
      if (this.headerItemShow === headerSearchItem) { // 判断这个是否已经打开 【已打开】
        console.log('已打开')
        this.headerItemShow = false
      } else { // 【未打开】
        console.log('未打开')
        this.headerItemShow = headerSearchItem // 展示选项
        this.getAllProductHeaderSearch(headerSearchItem) // 获取商品表头所有筛选项此时的所有值
      }
    },

    // 选择商品表头每个信息的筛选项
    choseSearchItem (key, value) {
      console.log(key, value)
      this.searchData[key] = value
      this.getProductBySearchData() // 调用通过searchData获取商品函数
    },

    // 切换商品展示列表（查看 已删除 vs 未删除）
    switchoverProductList (value) {
      console.log('切换商品展示列表（查看 已删除 vs 未删除）')
      this.searchData.exist = value // 只需要更新存在参数即可
      this.getProductBySearchData() // 获取商品通过搜索数据
    }
  }
}
</script>

<style scoped lang="less">
  .optionListActive{ /* 每个表头筛选的选项菜单项活跃状态 */
    background: #0086b3;
    color: #e4af91;
  }
  .headerSearchActive{ /* 每个表头活跃 */
    background: #df5000;
    color: #d6ff00;
  }
</style>
