<template>
    <div id="Masking" v-if="show">
      <p class="AppAllExplain">{{msg}}</p>
      <div class="backgroundMasking" v-on:click="closeThis">
        <p class="AppAllExplain">{{msg}}内部</p>
      </div>
    </div>
</template>

<script>
export default {
  name: 'masking',
  data () {
    return {
      msg: '全局基础蒙版小组件',
      show: false, // 是否展示
    }
  },
  mounted () {
    this.$windowFn.bus.$on('closeWindow_Masking', (e) => {
      console.log(e)
      this.show = e
    })
  },
  methods: {
    // 点击关闭
    closeThis () {
      console.log('关闭Masking')
      this.show = false
    }
  }
}
</script>

<style scoped lang="less">
  #Masking{
    .backgroundMasking{
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.7);
      z-index: 10;
    }
  }

</style>
