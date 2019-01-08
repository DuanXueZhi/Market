<template>
  <div id="app">
    <p class="AppAllExplain">{{msg}}</p>
    <router-view></router-view>
    <!--色板-->
    <!--目前所用色调-->
    <div>
      <div style="height: 150px; margin: 10px 0; color: red;display: inline-block;width: 150px;background-color: rgba(61, 83, 99, 1)">主色调：午夜蓝</div>
      <div style="height: 150px; margin: 10px 0; color: red;display: inline-block;width: 150px;background-color: rgba(86, 113, 143, 1)">副色调：普鲁士蓝</div>
    </div>
    <!--选色板-->
    <div style="height: 150px; margin: 10px 4px; color: white; display: inline-block; width: 150px;" v-bind:style="{backgroundColor: item}" v-for="(item, index) in colorId" :key="item">{{index}}：{{item}}</div>
  </div>
</template>

<script>
export default {
  name: 'App',
  data () {
    return {
      msg: 'App',
      colorId: [ // 颜色Id
        '#FFFFFF', '#FF0000', '#00FF00', '#0000FF',
        '#FF00FF', '#00FFFF', '#FFFF00', '#000000',
        '#70DB93', '#5C3317', '#9F5F9F', '#B5A642',
        '#D9D919', '#A67D3D', '#8C7853', '#5F9F9F',
        '#D98719', '#B87333', '#FF7F00', '#42426F',
        '#5C4033', '#3D5363', '#56718F', '#4682B4',
        '#27446E', '#D0E9FF', '#643E3B', '#005737'
      ]
    }
  }
}
</script>

<style lang="less">
  /*导入总的less文件main.less*/
  @import './assets/less/main.less';
  #app {
    min-width: 1200px;
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased; /*字体抗锯齿渲染*/
    -moz-osx-font-smoothing: grayscale;/*字体抗锯齿渲染*/
    color: #383838;
  }
  /*距离设置归零*/
  *{padding: 0;margin: 0;}
  /*清除列表格式*/
  li{list-style-type: none;}
  /*清除a标签的下划线*/
  a{text-decoration: none;}
  /*清除元素轮廓*/
  input,button,select,textarea{outline:none}
  /*阻止用户调整textarea标签的大小*/
  /*textarea{resize:none}*/
  /*图片垂直居中*/
  img{vertical-align:middle;}
  table{/*使用table标签时只需在标签中添加“border”字段即可显示出1边框*/
    width: 100%;
    text-align: center;
    border-collapse: collapse;/*无表格间距*/
    border-spacing: 0;/*控制中间空隙，若设置间距属性时*/
    border-color: black;
  }
  /*前端单方面阻止网页中文本选中*/
  /*body {*/
    /*-moz-user-select: none; !*火狐*!*/
    /*-webkit-user-select: none; !*webkit浏览器*!*/
    /*-ms-user-select: none; !*IE10*!*/
    /*-khtml-user-select: none; !*早期浏览器*!*/
    /*user-select: none;*/
  /*}*/

  /*页面and界面最顶部说明*/
  .AppAllExplain{
    color: red;
    font-weight: 700;
    text-align: center;
    /*display: none;*/
  }
  /*
  display:none;会让元素完全从渲染树中消失，渲染的时候不占据任何空间；
  visibility: hidden;不会让元素从渲染树消失，渲染师元素继续占据空间，只是内容不可见
  display: none;是非继承属性，子孙节点消失由于元素从渲染树消失造成，通过修改子孙节点属性无法显示；
  visibility: hidden;是继承属性，子孙节点消失由于继承了hidden，通过设置visibility: visible;可以让子孙节点显示；
  修改常规流中元素的display通常会造成文档重排。修改visibility属性只会造成本元素的重绘。
  读屏器不会读取display: none;元素内容；会读取visibility: hidden;元素内容
  */
</style>
