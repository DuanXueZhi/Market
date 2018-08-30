<template>
  <div id="NormalLoading">
    <p class="AppAllExplain">{{msg}}</p>
    参数：{{abc}}
  </div>
</template>

<script>
export default {
  name: 'normal-loading',
  data () {
    return {
      msg: '公用-正常loading小组件',
      abc: ''
    }
  }
}
</script>

<style scoped>

</style>
