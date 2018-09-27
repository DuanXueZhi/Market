<template>
  <div id="AddNewGoods">
    <p class="AppAllExplain">{{msg}}</p>
    <!--数据写法-->
    <div>
      <h3>新品上架</h3>
      <div style="text-align: center;">
        <p>货号<span style="color: red;" v-if="!productId">*</span>：</p>
        <input type="text" placeholder="productId" v-model="productId"><span style="color: red;" v-if="mustFilled === 'id'">此项必填</span>
        <p>商品名<span style="color: red;" v-if="!productName">*</span>：</p>
        <input type="text" placeholder="productName" v-model="productName"><span style="color: red;" v-if="mustFilled === 'name'">此项必填</span>
        <p>厂商：</p>
        <input type="text" placeholder="productSeller" v-model="productSeller">
        <div>
          <p>商品图片：</p>
          <ul>
            <!--已输入个数-->
            <li>
                <span>{{(successBase64Image.length === 0)? '未上传任何图片' : '已上传成功'}}</span
                ><span style="color: red;">{{successBase64Image.length}}</span
            ><span>张，</span>
            </li>
            <!--已输入部分-->
            <li style="display: inline-block;margin-left: 20px;position: relative;" v-for="(item, index) in successBase64Image" :key="item" v-on:mouseenter="deleteImgBtn = index" v-on:mouseleave="deleteImgBtn = false">
              <img style="display: inline-block;width: 200px;height: 200px;border: 1px solid black;" v-bind:src="item" v-bind:alt="item">
              <!--<span  v-if="deleteImgBtn" style="display: inline-block;border-radius: 50%;background: red;color: rgb(255, 255, 255);padding: 0 6px;font-size: 22px;font-weight: 600;position: absolute;top: -12px;right: -13px;">×</span>-->
              <span style="position: absolute;top: -9px;right: -8px;color: red;cursor: pointer;background: #fff;-webkit-border-radius: 50%;-moz-border-radius: 50%;border-radius: 50%;" v-if="deleteImgBtn === index" v-on:click="deleteImage(index)"><i class="iconfont icon-biaodanzhongyichu"></i></span>
            </li>
            <!--输入框-->
            <li style="position: relative;display: inline-block;" v-for="(item, index) in uploadNum" :key="item" v-if="index + 1 === uploadNum">
              <input type="file" style="opacity: 0;border: 1px solid red;width: 50px;height: 50px;position: absolute;right: 0;" v-on:change="uploadImage">
              <span style="display: inline-block;border: 1px solid black;padding: 0 12px;font-size: 42px;">+</span>
            </li>
          </ul>
        </div>
        <p>详情：</p>
        <input type="text" placeholder="productDetails" v-model="productDetails">
        <div>
          <p>颜色：</p>
          <input type="text" placeholder="productColor" v-model="productColor"
          ><span style="margin-left: 6px; color: green; font-size: 14px;" v-if="productColor !== '' && serverColorData.indexOf(productColor) === -1">新颜色</span>
          <br>
          <button style="width: 60px; height: 24px; margin: 2px 5px;" v-for="(color, index) in serverColorData" :key="color.value" :title="index + 1" @click="productColor = color">{{color}}</button>
        </div>
        <div>
          <p>分类：</p>
          <input type="text" placeholder="productGenre" v-model="productGenre"
          ><span style="margin-left: 6px; color: green; font-size: 14px;" v-if="productGenre !== '' && serverGenreData.indexOf(productGenre) === -1">新分类</span>
          <br>
          <button style="width: 60px; height: 24px; margin: 2px 5px;" v-for="(genre, index) in serverGenreData" :key="genre.value" :title="index + 1" @click="productGenre = genre">{{genre}}</button>
        </div>
        <div style="display: inline-block; width: 600px; text-align: left;">
          <p>商品规格：</p>
          <div>
              <span>所有规格：</span
              ><input type="text" v-model="ruleSizes"
          ><span>总数（条）：</span
          ><input type="number" v-model="productSum"
          ><button @click="distributeRule(ruleSizes, productSum)">确定</button>
          </div>
          <div v-for="(item, index) in productSpecifications" :key="item.size[index]">
              <span>尺码{{index + 1}}：</span
              ><input type="text" v-model="item.size" v-on:blur="countProductSize"
          ><span>数量（条）：</span
          ><input type="number" v-model="item.number" v-on:blur="countProductSum"
          ><span @click="deleteSpecifications(index)"><i class="iconfont icon-jianshao" style="color: red; margin-left: 10px; cursor: pointer;"></i></span>
          </div>
          <span @click="addSpecifications"><i class="iconfont icon-tianjia" style="font-size: 22px; cursor: pointer;"></i></span>
        </div>
        <p>进价（元）：</p>
        <input type="number" placeholder="productOriginalPrice" v-model="productOriginalPrice">
        <p>批量售价（元）：</p>
        <input type="number" placeholder="productBatchPrice" v-model="productBatchPrice">
        <p>零售价（元）：</p>
        <input type="number" placeholder="productSoloPrice" v-model="productSoloPrice">
        <p>备注：</p>
        <input type="text" placeholder="productExplain" v-model="productExplain">
        <br><button @click="addGoods">提交</button>
        <img style="display: inline-block; width: 100px; height: 100px;" v-for="image in uploadSuccessImage" :key="image" v-bind:src="image" alt="">
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
      productDetails: '', // 商品详情
      productColor: '', // 商品颜色
      productSpecifications: [ // 商品规格
        {size: '', number: 0}
      ],
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
      deleteImgBtn: false, // 图片删除按钮显示决定变量
      mustFilled: false, // 是否已填写所有必填项
      uploadSuccessImage: [], // 上传成功的图片数组
      serverColorData: [], // 数据库中颜色字段的所有数据
      serverGenreData: [], // 数据库中分类字段的所有数据
      ruleSizes: '', // 所有规格放在一起的字符串
      productSum: 0 // 商品总数
    }
  },
  created () {
    // 获取标签（数据库中已有的字段值）
    this.$sendRequest.RTSGet('/rm_goods/find_title', {userId: '用户id'}).then(res => {
      // console.log('查询颜色、分类字段标签值')
      if (res.data.code === 0) {
        // console.log('查询成功!')
        this.serverColorData = res.data.data.colorData
        this.serverGenreData = res.data.data.genreData
      } else if (res.code === 1) {
        console.log('后台出错!')
      } else {
        console.log('出错')
      }
    })
  },
  mounted () {
    // this.$windowFn.allWindow('AddNewGoods', '警告', '内容', '确定') // 测试
  },
  methods: {
    // 上传图片
    uploadImage (event) {
      console.log('上传图片')
      let file = event.target.files[0]
      let reader = new FileReader()
      // 读取图片
      reader.readAsDataURL(file) // 发起异步请求（读取图片）
      reader.onloadend = (e) => { // 读取完了以后开始转为base64
        console.log('读取完了以后开始转为base64')
        if (this.successBase64Image.indexOf(reader.result) === -1) {
          console.log('正常写入数组中')
          this.successBase64Image.push(reader.result)
          // this.successBase64Image[this.uploadNum - 1] = reader.result
          this.uploadNum++
        } else {
          console.log('与原来图片重复，不写入数组！')
          this.$windowFn.allWindow('AddNewGoods', '提示', '已上传此图片，不需要再传了', '晓得了')
        }
      }

      // var res = this.$sendRequest.RTSPost('/rm_upload_image/upload', '123')
      // console.log(res);

      // 此图片上传成功后收到地址并push进successImage中
      // this.successBase64Image.push(file)
      console.log('this.successBase64Image', this.successBase64Image, typeof this.successBase64Image)
    },

    // 分散规格数据
    distributeRule (sizes, sum) {
      console.log('拆分整合规格数据')
      var sizeArray = sizes.split(',') // 尺码数组（转化而来）
      var eachSizeNumber = parseInt(sum / sizeArray.length) // 均分总数（便利用户操作）
      sizeArray.forEach((e, index) => { // 给productSpecifications赋值
        this.productSpecifications[index].size = e
        this.productSpecifications[index].number = eachSizeNumber
        if (this.productSpecifications.length < sizeArray.length) {
          this.addSpecifications()
        }
      })
      if (sum % sizeArray.length !== 0) { // 判断整数or小数
        // 小数
        var differNumber = sum - eachSizeNumber * sizeArray.length
        this.productSpecifications[0].number = eachSizeNumber + differNumber
      }
    },

    // 更新尺码个数及值
    countProductSize () {
      console.log('更新尺码个数及值')
      this.ruleSizes = '' // 清空一下值
      this.productSpecifications.forEach((e, index) => {
        if (index < this.productSpecifications.length - 1) {
          this.ruleSizes += e.size + ','
        } else {
          this.ruleSizes += e.size
        }
      })
    },

    // 计算总数
    countProductSum () {
      console.log('计算总数函数')
      this.productSum = 0 // 清空一下原值避免叠加
      this.productSum = Number(this.productSum) // 转换总数类型
      this.productSpecifications.forEach(e => {
        e.number = Number(e.number)
        console.log(e.number, typeof e.number, typeof this.productSum)
        this.productSum += e.number
      })
    },

    // 添加规格({尺码:'', 数量:''})
    addSpecifications () {
      // console.log('添加一个规格输入框')
      this.productSpecifications.push({size: '', number: ''})
    },

    // 删除规格
    deleteSpecifications (ruleIndex) {
      // console.log('删除第' + ruleIndex + '个规格输入框')
      this.productSpecifications.splice(ruleIndex, 1)
      this.countProductSize() // 计算尺码
      this.countProductSum() // 计算数量
    },

    // 提交商品
    addGoods () {
      console.log('提交商品')
      if (this.productId !== '') { // 判断必填项
        if (this.productName !== '') { // 判断必填项
          this.mustFilled = true // 必填已填
          // 转换商品名为拼音（调用外部函数）
          var nameSpell = this.$jsfn.fnChangeSpell(this.productName)
          this.productNameFullSpell = nameSpell[0]
          this.productNameFirstSpell = nameSpell[1]
          // 封装到productData对象
          this.productData.productId = this.productId // 商品Id
          this.productData.productName = this.productName // 商品名
          this.productData.productNameAddId = this.productName + this.productName // 商品名+id
          this.productData.productNameFirstSpell = this.productNameFirstSpell // 商品首拼（生成）
          this.productData.productNameFullSpell = this.productNameFullSpell // 品名全拼（生成）
          this.productData.productSeller = this.productSeller // 厂商
          this.productData.productImage = this.successBase64Image // 商品图片（已转换为base64格式的数组）
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
          this.$sendRequest.RTSPost('/rm_goods/add_goods', this.productData).then(res => {
            console.log(res)
            this.uploadSuccessImage = res.data.image
            this.$windowFn.allWindow('AddNewGoods', '恭喜', {text: '已成功添加' + this.productName + this.productId + '商品', image: res.data.image}, '知道了') // 触发弹窗函数以提醒用户
          })
        } else {
          // console.log('productName为空')
          this.mustFilled = 'name'
        }
      } else {
        // console.log('productId为空')
        this.mustFilled = 'id'
      }
    },

    // 删除未提交(存入successBase64Image中)的图片
    deleteImage (index) {
      // 警告弹窗
      // console.log('AddNewGoods.vue中引起警告弹窗')
      this.$windowFn.allWindow('AddNewGoods', '警告', '确定删除此图片吗？', '确定').then((e) => {
        // console.log('父元素收到返回值打印', e)
        this.successBase64Image.splice(index, 1)
      })
      // console.log('结束？')
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
      console.log(data)
    },
    send () {
      this.$sendRequest.RTSGet('/image', '123').then(res => {
        this.picture = res.data.image
        console.log(this.picture)
      })
    }
  }
}
</script>

<style scoped lang="less">

</style>
