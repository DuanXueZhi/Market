<template>
    <div id="WarningRemindWindow" v-if="show">
      <p class="AppAllExplain">{{msg}}</p>
      <div class="AllBaseBackgroundMasking" v-on:click="close"></div><!--公用蒙版，样式代码在base.less文件中-->
      <div class="window">
        <p class="AppAllExplain">{{msg}}内部</p>
        <div class="head">
          <span class="close" v-on:click="close">×</span>
        </div>
        <div class="body">
          <div class="title">
            <span v-bind:style="{color: titleColor}" v-if="windowGenre === 'warning' || windowGenre === 'remind'"><i class="iconfont icon-jinggao"></i></span>
            <span v-bind:style="{color: titleColor}" v-if="windowGenre === 'congratulations'"><i class="iconfont icon-chenggongicon"></i></span>
            <span class="titleText">{{titleText}}</span>
          </div>
          <div class="contentTextBox" v-if="typeof contentText === 'string'">
            <p>{{contentText}}</p>
          </div>
          <div class="contentTextBox" v-if="typeof contentText === 'object'">
            <p>{{contentText.text}}</p>
            <p class="imageListBox"><span class="imageEachBox" v-for="(item, index) in contentText.image" :key="index + 'window'"><img :src="item" alt=""></span></p>
          </div>
        </div>
        <div class="footer">
          <!-- 此处按调用者有无等待回调来区别显示 -->
          <div class="warning" v-if="callBackFn">
            <span class="confirm" v-on:click="operateBtn(true)">{{operateText.agree}}</span>
            <span class="cancel" v-on:click="operateBtn(false)">{{operateText.cancel === ''? '取消' : operateText.cancel}}</span>
          </div>
          <div class="remind" v-if="!callBackFn">
            <span class="confirm" v-on:click="close">{{operateText.agree}}</span>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
export default {
  name: 'warning-remind-window',
  data () {
    return {
      msg: '警告or提示or恭喜弹窗小组件',
      show: false, // 是否显示
      windowGenre: '', // 弹框类型
      titleColor: '', // 标题图标的颜色
      titleText: '', // 标题文字
      contentText: '', // 内容文字
      operateText: { // 操作按钮文字
        agree: '', // true按钮
        cancel: '' // false按钮
      },
      callBackFn: false // 调用页面有无等待返回值
    }
  },
  mounted: function () {

  },
  methods: {
    // 关闭
    close () {
      console.log('关闭弹窗')
      this.show = false
    },
    // 确认or取消（底部操作按钮）
    operateBtn (option) {
      console.log('警告弹窗中点击底部按钮操作')
      var windowData = { // 弹框要返回的数据
        code: 2,
        msg: 'W-RWindow组件中异常'
      }
      if (option) {
        console.log('警告弹窗中点击确认')
        windowData = { // 更新返回值
          code: 0,
          msg: 'W-RWindow组件中警告弹窗中点击确认'
        }
      } else {
        console.log('警告弹窗中点击取消')
        windowData = { // 更新返回值
          code: 1,
          msg: 'W-RWindow组件中警告弹窗中点击取消'
        }
      }
      this.$windowFn.bus.$emit('windows-confirmAgree', windowData) // 创建bus进行通讯
      this.close() // 关闭弹窗
    }
  }
}
</script>

<style scoped lang="less">
  @import '../../../assets/less/main';

  #WarningRemindWindow{
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
    text-align: center;
    .head{
      height: 44px;
      background: @color-secondary;
      .close{
        float: right;
        margin-right: 10px;
        font-size: 30px;
        cursor: pointer;
        color: #fff;
      }
      .close:hover{

      }
    }
    .body{
      border-top: 1px solid #666;
      padding: 10px 20px;
      text-align: center;
      .title{
        font-size: 20px;
        font-weight: 700;
        .titleText{
          margin-left: 4px;
        }
      }
      .contentTextBox{
        padding: 20px 10px;
        .imageListBox{
          margin-top: 10px;
          .imageEachBox{
            display: inline-block;
            width: 50px;
            height: 50px;
            margin: 0 5px;
            >img{
              width: 100%;
              height: 100%;
            }
          }
        }
      }
    }
    .footer{
      padding-bottom: 20px;
      .warning,.remind{
        >span{
          border: 1px solid @color-secondary; // 使用副色调
          padding: 4px 10px;
          .border_radius(4px);
          cursor: pointer;
          &.confirm{
            background: @color-secondary-tint; // 使用副色调浅
            color: #fff;
            margin-right: 4px;
          }
          &.cancel{
            color: @color-secondary; // 使用副色调
            margin-left: 4px;
          }
        }
      }
    }
  }
}
</style>
