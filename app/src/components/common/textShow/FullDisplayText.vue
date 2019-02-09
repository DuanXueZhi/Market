<template>
  <div id="FullDisplayText" style="position: absolute; "
       :style="{
          left: left + 'px',
          top: top + 'px',
          width: width + 'px'
       }">
    <p class="AppAllExplain">{{msg}}</p>
    <p>{{fullText}}</p>
  </div>
</template>

<script>
export default {
  name: 'full-display-text',
  data () {
    return {
      msg: '文字全部展示小组件',
      show: false, // 展示
      data: '', // 数据
      top: 0, // 菜单上定位
      left: 0, // 菜单左定位
      width: 0 // 菜单宽度
    }
  }
}
</script>

<style scoped>

</style>
