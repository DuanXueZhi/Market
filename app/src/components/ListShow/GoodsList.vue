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
              <td>{{product.productSeller}}</td>
              <td>
                <div style="width: 50px; height: 50px;" v-for="(image, index) in product.productImage" :key="image">
                  <img style="width: 100%; height: 100%;" :src="image" :alt="index">
                </div>
              </td>
              <td>{{product.productDetails}}</td>
              <td>{{product.productColor}}</td>
              <td>{{product.productSpecifications}}</td>
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
                <button>修改</button>
                <button>删除</button>
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
    // 请求数据
    this.$sendRequest.RTSGet('/rm_goods/complete_goods', '').then(res => {
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
  }
}
</script>

<style scoped>

</style>
