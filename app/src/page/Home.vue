<template>
    <div id="Home">
      <p class="AppAllExplain">{{msg}}</p>
      <!--头部-->
      <div>
        <p>之后要写成组件拼接进来</p>
        <router-link :to="{name: 'AddNewGoods'}">添加商品</router-link>
        <router-link to="/ListShow">查看本店信息</router-link>
      </div>
      <!--主体-->
      <router-view></router-view>
      <!--底部-->
      <div>
        <p>之后要写成组件拼接进来</p>
        <table border>
          <thead>
            <tr>
              <th>1</th>
              <th>2</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>2</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
</template>

<script>
export default {
  name: 'Home',
  data () {
    return {
      msg: '主页页面'
    }
  }
}
</script>

<style scoped>

</style>
