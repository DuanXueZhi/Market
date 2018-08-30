<template>
    <div id="WarningWindow">
      <p class="AppAllExplain">{{msg}}</p>
      <div class="AllBaseBackgroundMasking"></div><!--公用蒙版，样式代码在base.less文件中-->
      <div class="window">
        <p class="AppAllExplain">{{msg}}内部</p>
        <div class="head"></div>
        <div class="body">
          <div class="title">
            <span v-bind:style="{color: titleColor}"><i class="iconfont icon-jinggao"></i></span>
            <span class="titleText">{{titleText}}</span>
          </div>
          <p class="contentText">{{contentText}}</p>
        </div>
        <div class="footer">
          <button v-on:click="confirmAgree">{{operateText}}</button>
          <button>取消</button>
        </div>
      </div>
    </div>
</template>

<script>
export default {
  name: 'warning-window',
  data () {
    return {
      msg: '警告弹窗小组件',
      titleColor: '', // 标题图标的颜色
      titleText: '', // 标题文字
      contentText: '', // 内容文字
      operateText: '' // 操作按钮文字
    }
  },
  mounted: function () {

  },
  methods: {
    // 确认
    confirmAgree () {
      console.log('警告弹窗中点击确认')
      this.$windowFn.bus.$emit('confirmAgree', 'WarningWindow组件中警告弹窗中点击确认')
      // 关闭弹窗及蒙版
      // this.$jsfn.closeWindow_Masking(this.msg)
      this.$windowFn.bus.$emit('closeWindow_Masking', false)
    }
  }
}
</script>

<style scoped lang="less">
@import '../../../assets/less/main';

#WarningWindow{
  .window{
    z-index: 11; /*Masking蒙版部分是10*/
    position: fixed;
    left: 0;
    right: 0;
    top: 50%;
    margin: auto;
    .transform(translate(0, -50%));
    width: 500px;
    background: #fff;
    .border_radius(8px);
    overflow: hidden;

    .head{
      height: 30px;
      border-bottom: 1px solid #666;
      background: @color-secondary;
    }
  }
}
</style>
