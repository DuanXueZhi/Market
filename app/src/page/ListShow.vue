<template>
  <div id="ListShow">
    <p class="AppAllExplain">{{msg}}</p>
    <!--顶部-->
    <top-base></top-base>
    <!--头部-->
    <div>
      <p>之后要写成组件拼接进来，后期要根据身份来确定菜单显示的内容，“游客”不能显示进货单</p>
      <router-link :to="{name: 'GoodsList'}">查看商品列表</router-link>
      <router-link :to="{name: 'PurchasesList'}">查看进货列表</router-link>
    </div>
    <!--主体-->
    <router-view></router-view>
    <!--底部-->
    <div>
      <p>之后要写成组件拼接进来</p>
    </div>
  </div>
</template>

<script>
import TopBase from '../components/Base/TopBase' // 基础顶部组件

export default {
  name: 'list-show',
  components: {
    'TopBase': TopBase
  },
  data () {
    return {
      msg: '（回货、商品、订单等）列表展示页面'
    }
  }
}
</script>

<style scoped>

</style>
