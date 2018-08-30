<template>
    <div id="AddNewGoods">
      <p class="AppAllExplain">{{msg}}</p>
      <!--骨架写法-->
      <div>
        <h3>新品上架</h3>
        <div style="text-align: center;">
          <p>货号：</p>
          <input type="text" placeholder="productId" v-model="productId">
          <p>商品名：</p>
          <input type="text" placeholder="productName" v-model="productName">
          <p>厂商：</p>
          <input type="text" placeholder="productSeller" v-model="productSeller">
          <!--商品图片、另外提交 v-model="productImage"-->
          <div>
            <p>商品图片：</p>
            <ul>
              <!--已输入部分-->
              <li style="display: inline-block;margin-left: 20px;position: relative;" v-for="(item, index) in successBase64Image" v-on:mouseenter="deleteBtn = index" v-on:mouseleave="deleteBtn = false">
                <img style="display: inline-block;width: 200px;height: 200px;border: 1px solid black;" v-bind:src="item" v-bind:alt="item">
                <!--<span  v-if="deleteBtn" style="display: inline-block;border-radius: 50%;background: red;color: rgb(255, 255, 255);padding: 0 6px;font-size: 22px;font-weight: 600;position: absolute;top: -12px;right: -13px;">×</span>-->
                <span style="position: absolute;top: -9px;right: -8px;color: red;cursor: pointer;background: #fff;-webkit-border-radius: 50%;-moz-border-radius: 50%;border-radius: 50%;" v-if="deleteBtn === index" v-on:click="deleteImage(index)"><i class="iconfont icon-biaodanzhongyichu"></i></span>
              </li>
              <!--输入框-->
              <li style="position: relative;display: inline-block;" v-for="(item, index) in uploadNum" v-if="index + 1 === uploadNum">
                <span>{{(index === 0)? '未上传任何图片' : '已上传成功'+index+'张'}}</span>
                <input type="file" style="opacity: 0;border: 1px solid red;width: 50px;height: 50px;position: absolute;right: 0;" v-on:change="uploadImage">
                <span style="display: inline-block;border: 1px solid black;padding: 0 12px;font-size: 42px;">+</span>
              </li>
            </ul>
          </div>
          <p>详情：</p>
          <input type="text" placeholder="productDetails" v-model="productDetails">
          <p>颜色：</p>
          <input type="text" placeholder="productColor" v-model="productColor">
          <p>规格：</p>
          <input type="text" placeholder="productSpecifications" v-model="productSpecifications">
          <p>分类：</p>
          <input type="text" placeholder="productGenre" v-model="productGenre">
          <p>进价：</p>
          <input type="text" placeholder="productOriginalPrice" v-model="productOriginalPrice">
          <p>批量售价：</p>
          <input type="text" placeholder="productBatchPrice" v-model="productBatchPrice">
          <p>零售价：</p>
          <input type="text" placeholder="productSoloPrice" v-model="productSoloPrice">
          <p>备注：</p>
          <input type="text" placeholder="productExplain" v-model="productExplain">
          <br><button @click="addGoods">提交</button>
          <!--全屏-->
          <p v-kiko-loading.fullscreen="loadingFullscreen">
            <button class="btn btn-info" style="position: relative" @click="loadingFullscreen = !loadingFullscreen">loadingFullscreen</button>
          </p>
        </div>
      </div>
    </div>
</template>

<script>
// import * as main from '../../assets/js/jsfn'
// import * as Https from '../../assets/js/sendRequest'

export default {
  name: 'add-new-goods',
  data () {
    return {
      msg: '添加新商品界面',
      productId: '', // 商品号(若是一号多色，要加上颜色)
      productName: '', // 商品名
      productNameFirstSpell: '', // 品名首拼（生成）
      productNameFullSpell: '', // 品名全拼（生成）
      productSeller: '', // 厂商
      productImage: [], // 商品图片
      productDetails: '', // 商品详情
      productColor: '', // 商品颜色
      productSpecifications: [], // 商品规格
      productGenre: '', // 商品分类
      productOriginalPrice: 0, // 商品进价
      productBatchPrice: 0, // 商品批量售价
      productSoloPrice: 0, // 商品零售价
      userId: '直接获取用户名，在后台兑换为users_id', // 商品操作者
      productExplain: '暂无', // 商品备注
      exist: true, // 是否存在（删除时使用）
      // --------------------------------本业数据---------------------------- \\
      productData: {}, // 商品数据
      successBase64Image: [], // 展示的图片数量
      uploadNum: 1, // 上传的图片数量
      deleteBtn: false, // 图片删除按钮显示决定变量
      loadingFullscreen: '', // 全屏loading实验
    }
  },
  mounted () {
    // this.$windowFn.allWindow('AddNewGoods', '警告', '内容', '确定') // 测试
  },
  methods: {
    // 提交商品
    addGoods () {
      console.log('提交商品')
      // 转换商品名为拼音（调用外部函数）
      var nameSpell = this.$jsfn.fnChangeSpell(this.productData.productName)
      this.productNameFullSpell = nameSpell[0]
      this.productNameFirstSpell = nameSpell[1]
      // 封装到productData对象
      this.productData.productId = this.productId
      this.productData.productName = this.productName
      this.productData.productNameFirstSpell = this.productNameFirstSpell
      this.productData.productNameFullSpell = this.productNameFullSpell // 品名全拼（生成）
      this.productData.productSeller = this.productSeller // 厂商
      this.productData.productImage = this.productImage // 商品图片
      this.productData.productDetails = this.productDetails // 商品详情
      this.productData.productColor = this.productColor // 商品颜色
      this.productData.productSpecifications = this.productSpecifications // 商品规格
      this.productData.productGenre = this.productGenre // 商品分类
      this.productData.productOriginalPrice = this.productOriginalPrice // 商品进价
      this.productData.productBatchPrice = this.productBatchPrice // 商品批量售价
      this.productData.productSoloPrice = this.productSoloPrice // 商品零售价
      this.productData.userId = this.userId // 商品操作者
      this.productData.productExplain = this.productExplain // 商品备注
      this.productData.exist = this.exist // 是否存在（删除时使用）
      console.log(this.productData)
      // 发送请求并接收参数
      var res = this.$sendRequest.RTSPost('/rm_goods/add_goods', this.productData)
      console.log(res)
    },

    // 上传图片
    uploadImage (event) {
      console.log('上传图片')
      let file = event.target.files[0]
      let reader = new FileReader()
      // 读取图片
      reader.readAsDataURL(file) // 发起异步请求（读取图片）
      reader.onloadend = (e) => { // 读取完了以后开始转为base64
        console.log('读取完了以后开始转为base64')
        // console.log(e, e.target.result, reader.result);
        this.successBase64Image.push(reader.result)
      }

      // var res = this.$sendRequest.RTSPost('/rm_upload_image/upload', '123')
      // console.log(res);

      // 此图片上传成功后收到地址并push进successImage中
      // this.successBase64Image.push(file)
      this.uploadNum++
      console.log(this.successBase64Image)
    },

    // 删除未提交(存入successBase64Image中)的图片
    deleteImage (index) {
      // 警告弹窗
      console.log('AddNewGoods.vue中引起警告弹窗')
      this.$windowFn.allWindow('AddNewGoods', '警告', '内容', '确定').then((e) => {
        console.log('父元素收到返回值打印', e)
        this.successBase64Image.splice(index, 1)
      })
      console.log('结束？');

    },
    /*
    * 笔记
    * */
    // 正则实验
    regexp (data) {
      console.log('--------------------------------正则实验------------------------------')
      var reg = new RegExp('^(?=.*[0-9])(?=.*[A-Za-z])(?=.*[~!@#%^&*\\$\\-\\_+=;:\'"\\{\\}<>,.?/|\\[\\]()\\\\\\，\\（\\）\\——\\—\\【\\】\\；\\：\\‘\\”\\、\\`\\·\\《\\》\\，\\。\\？\\！\\￥……]).{8,16}$') // 正则 必须包含字母、数字、特殊字符且长度为8-16位
      // var reg = new RegExp('^(?=.*[0-9])(?=.*[A-Za-z])(?=.*[/\\()-,;:\'!@#%&/*/?/|/_/+/{/}/[/]/^/$/.//]).{8,16}$') // 正则 必须包含字母、数字、特殊字符且长度为8-16位
      if (reg.test(this.productId)) {
        console.log(reg.test(this.productId))
        console.log('符合')
      } else {
        console.log(reg.test(this.productId))
        console.log('不符合')
      }
      console.log(data);
    }
  }
}
</script>

<style scoped lang="less">

</style>
