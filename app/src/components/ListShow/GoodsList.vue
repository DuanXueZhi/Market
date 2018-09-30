<template>
    <div id="GoodsList">
      <p class="AppAllExplain">{{msg}}</p>
      <!--数据写法-->
      <div>
        <table>
          <thead>
            <tr>
              <th>序号</th>
              <th>商品码</th>
              <th>商品名</th>
              <th>品名+id</th>
              <th>厂商</th>
              <th>图片</th>
              <th>详情</th>
              <th>颜色</th>
              <th>规格</th>
              <th>分类</th>
              <th>单品进价</th>
              <th>单品批发价</th>
              <th>单品零售价</th>
              <th>操作者</th>
              <th>备注</th>
              <th>创建时间</th>
              <th>最后修改时间</th>
              <th>存在？</th>
              <!--<th>_id</th>-->
              <!--<th>首拼</th>-->
              <!--<th>全拼</th>-->
              <!--<th>__v</th>-->
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(product, index) in goodsList" :key="product._id">
              <td>{{index + 1}}</td>
              <td>{{product.productId}}</td>
              <td>{{product.productName}}</td>
              <td>{{product.productNameAddId}}</td>
              <td>{{product.productSeller}}</td>
              <td>
                <div style="width: 50px; height: 50px;" v-for="(image, index) in product.productImage" :key="image">
                  <img style="width: 100%; height: 100%;" :src="image" :alt="index">
                </div>
              </td>
              <td>{{product.productDetails}}</td>
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
              <td>{{product.productGenre}}</td>
              <td>{{product.productOriginalPrice}}</td>
              <td>{{product.productBatchPrice}}</td>
              <td>{{product.productSoloPrice}}</td>
              <td>{{product.userId}}</td>
              <td>{{product.productExplain}}</td>
              <td>{{product.meta.createAt}}</td>
              <td>{{product.meta.updateAt}}</td>
              <td>{{product.exist}}</td>
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
      goodsList: []
    }
  },
  created () {
    var vm = this
    vm.getDataList()
  },
  methods: {
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
          this.$windowFn.allWindow('GoodsList', '提示', res.data.msg + '刷新一下试试', '晓得了') // 调用一下提示弹窗
        }
      })
    },

    // 删除商品函数
    operateProduct (operate, product) {
      var vm = this
      const markedWords = function (data) { // 内部公用请求回调
        if (data.data.code === 0) {
          // console.log('删除成功')
          vm.getDataList() // 调用获取数据（商品）列表函数
        } else if (data.data.code === 1) {
          // console.log('删除失败')
          this.$windowFn.allWindow('GoodsList', '提示', data.data.msg + '刷新一下试试', '晓得了') // 调用弹窗提示重试
        }
      }
      if (operate === 'delete') {
        console.log('删除操作')
        this.$sendRequest.RTSDelete('/rm_goods/delete_goods', {userId: '用户Id', product_id: product._id}).then(markedWords)
      } else if (operate === 'update') {
        console.log('修改操作')
      } else if (operate === 'admin_delete') {
        // console.log('管理员删除')
        this.$windowFn.allWindow('GoodsList', '警告', '用户名作为管理员：您确定删除' + product.productName + product.productId + '商品吗？', '确定').then(res => {
          this.$sendRequest.RTSDelete('/rm_goods/delete_goods', {userId: '用户Id', product_id: product._id}).then(markedWords)
        })
      }
    }
  }
}
</script>

<style scoped>

</style>
