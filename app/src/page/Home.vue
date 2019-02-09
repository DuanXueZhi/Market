<template>
  <div id="Home">
      <p class="AppAllExplain">{{msg}}</p>
      <!--顶部-->
      <top-base></top-base>
      <!--头部-->
      <div>
        <p>之后要写成组件拼接进来</p>
        <div v-if="$store.state.user.identity === 'boss' || $store.state.user.identity === 'assistant'" title="boss/assistant">
          <router-link :to="{name: 'AddNewGoods', query: {_id: 'add'}}">添加商品</router-link>
          <router-link :to="{name: 'AddNewPurchaseMsg', query: {_id: 'add'}}">到货添加</router-link>
          <router-link to="/ListShow">查看本店信息</router-link>
        </div>
        <router-link to="/User">用户中心</router-link>
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
  name: 'Home',
  components: {
    'TopBase': TopBase
  },
  data () {
    return {
      msg: '主页页面',
      operateUser: {} // 当前操作用户
    }
  },
  created () {},
  methods: {
    /*
    * 获取函数
    * */

    /*
    * 本页函数
    * */
    /* -------------共用函数-------------- */
    /* -------------函数-------------- */
  }
}
</script>

<style scoped>

</style>
