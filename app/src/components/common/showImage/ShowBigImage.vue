<template>
    <div id="ShowBigImage" v-if="show">
      <p class="AppAllExplain">{{msg}}</p>
      <div class="AllBaseBackgroundMasking" v-on:click="close"></div><!--公用蒙版，样式代码在base.less文件中-->
      <div class="image">
        <div class="imageBox">
          <img :src="image" alt="">
        </div>
        <div class="closeShow">
          <span class="text" v-on:click="close">×</span>
        </div>
      </div>
    </div>
</template>

<script>
export default {
  name: 'show-big-image',
  data () {
    return {
      msg: '展示大图小组件',
      show: false, // 是否显示
      image: '' // 要展示的图片
    }
  },
  mounted: function () {

  },
  methods: {
    // 关闭
    close () {
      console.log('图片展示关闭')
      this.show = false
    }
  }
}
</script>

<style scoped lang="less">
@import '../../../assets/less/main'; /* 导入主样式文件main.less */

#ShowBigImage{
  .image{
    z-index: 11; /*Masking蒙版部分是10*/
    position: fixed;
    left: 0;
    right: 0;
    top: 50%;
    margin: auto;
    .transform(translate(0, -50%));
    width: 1000px;
    .border_radius(8px);
    overflow: hidden;
    text-align: center;
    .imageBox{
      padding: 10px;
      background: @color-secondary; /* 副色调 */
      >img{
        width: 100%;
      }
    }
    .closeShow{
      .text{
        cursor: pointer;
        font-size: 60px;
        color: #fff;
      }
      .text:active{ /* 点击效果 */
        position: relative;
        top: 5px; /* 不明显，哈哈，仅此笔记 */
        color: black;
      }
    }
  }
}
</style>
