<template>
  <div id="AddNewGoods">
    <p class="AppAllExplain">{{msg}}</p>
    <!--数据写法-->
    <div>
      <h3>{{goodsId === 'add'? '新品上架' : '修改' + goodsId + '商品'}}</h3>
      <!--左侧原数据-->
      <div style="text-align: center; float: left;" v-if="goodsId !== 'add'">
        <h4>原数据</h4>
        <p>货号：</p>
        <input type="text" disabled placeholder="productId" v-model="originalProductData.productId">
        <p>商品名：</p>
        <input type="text" disabled placeholder="productName" v-model="originalProductData.productName">
        <p>厂商：</p>
        <input type="text" disabled placeholder="productSeller" v-model="originalProductData.productSeller">
        <div>
          <p>商品图片：</p>
          <ul>
            <!--已输入个数-->
            <li>
              <span>{{(originalProductData.productImage.length === 0)? '未上传任何图片' : '已上传成功'}}</span
              ><span style="color: red;">{{originalProductData.productImage.length}}</span
              ><span>张，</span>
            </li>
            <!--已输入部分-->
            <li style="display: inline-block;margin-left: 20px;position: relative;" v-for="(item, index) in originalProductData.productImage" :key="item[index]">
              <img style="display: inline-block;width: 200px;height: 200px;border: 1px solid black;" v-bind:src="item" v-bind:alt="item">
            </li>
          </ul>
        </div>
        <p>详情：</p>
        <input type="text" disabled placeholder="productDetails" v-model="originalProductData.productDetails">
        <div>
          <p>颜色：</p>
          <input type="text" disabled placeholder="productColor" v-model="originalProductData.productColor">
          <br>
          <button style="width: 60px; height: 24px; margin: 2px 5px;" v-for="(color, index) in serverColorData" :key="color.value" :title="index + 1" @click="productColor = color" v-if="color !== ''">{{color}}</button>
        </div>
        <div>
          <p>分类：</p>
          <input type="text" disabled placeholder="productGenre" v-model="originalProductData.productGenre">
          <br>
          <button style="width: 60px; height: 24px; margin: 2px 5px;" v-for="(genre, index) in serverGenreData" :key="genre.value" :title="index + 1" @click="productGenre = genre" v-if="genre !== ''">{{genre}}</button>
        </div>
        <div style="display: inline-block; width: 600px; text-align: left;">
          <p>商品规格：</p>
          <div>
            <span>所有规格：</span
            ><input type="text" disabled v-model="ruleSizes"
            ><span>总数（条）：</span
            ><input type="number" disabled v-model="productSum">
          </div>
          <div v-for="(item, index) in originalProductData.productSpecifications" :key="item.size[index]">
            <span>尺码{{index + 1}}：</span
            ><input type="text" disabled v-model="item.size" v-on:blur="countProductSize"
            ><span>数量（条）：</span
            ><input type="number" disabled v-model="item.number" v-on:blur="countProductSum">
          </div>
        </div>
        <p>进价（元）：</p>
        <input type="number" disabled placeholder="productOriginalPrice" v-model="originalProductData.productOriginalPrice">
        <p>批量售价（元）：</p>
        <input type="number" disabled placeholder="productBatchPrice" v-model="originalProductData.productBatchPrice">
        <p>零售价（元）：</p>
        <input type="number" disabled placeholder="productSoloPrice" v-model="originalProductData.productSoloPrice">
        <p>备注：</p>
        <input type="text" disabled placeholder="productExplain" v-model="originalProductData.productExplain">
      </div>
      <!--右侧新数据-->
      <div style="text-align: center;">
        <h4>可修改数据</h4>
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
              <input type="file" style="opacity: 0;border: 1px solid red;width: 50px;height: 50px;position: absolute;right: 0;" v-on:change="uploadImage" accept="image/*"> <!-- 仅支持所有图片文件 -->
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
          <button style="width: 60px; height: 24px; margin: 2px 5px;" v-for="(color, index) in serverColorData" :key="color.value" :title="index + 1" @click="productColor = color" v-if="color !== ''">{{color}}</button>
        </div>
        <div>
          <p>分类：</p>
          <input type="text" placeholder="productGenre" v-model="productGenre"
          ><span style="margin-left: 6px; color: green; font-size: 14px;" v-if="productGenre !== '' && serverGenreData.indexOf(productGenre) === -1">新分类</span>
          <br>
          <button style="width: 60px; height: 24px; margin: 2px 5px;" v-for="(genre, index) in serverGenreData" :key="genre.value" :title="index + 1" @click="productGenre = genre" v-if="genre !== ''">{{genre}}</button>
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
        <br><button @click="addGoods" v-if="goodsId === 'add'">提交</button>
        <br><button @click="addGoods" v-if="goodsId !== 'add'">确认修改</button>
        <!--<img style="display: inline-block; width: 100px; height: 100px;" v-for="image in uploadSuccessImage" :key="image" v-bind:src="image" alt="">-->
        <!--<input type="file" @change="testUploadImage">-->
      </div>
      <!--修改写法-->
      <hr>
      <div style="text-align: center; margin-top: 300px;">
        <h4>可修改数据</h4>
        <ul>
          <li style="border-top: 1px solid #999;" :style="{background: searchData.id === true ? '#b2e5b2' : '#ffdbdb'}">
            <div style="display: inline-block; width: 45%;"> <!--左-->
              <p>货号：</p>
              <input type="text" disabled placeholder="productId" v-model="originalProductData.productId">
            </div
            ><span style="border: 1px solid #666; border-radius: 50%; background: #f5f5b9; cursor: pointer;" @click="productId = originalProductData.productId">&gt;&gt;</span
            ><div style="display: inline-block; width: 45%;"> <!--右-->
              <p>货号<span style="color: red;" v-if="!productId">*</span>：</p>
              <input type="text" placeholder="productId" v-model="productId"><span style="color: red;" v-if="mustFilled === 'id'">此项必填</span>
            </div>
          </li>
          <li style="border-top: 1px solid #999;" :style="{background: productName === originalProductData.productName? '#b2e5b2' : '#ffdbdb'}">
            <div style="display: inline-block; width: 45%;"> <!--左-->
              <p>商品名：</p>
              <input type="text" disabled placeholder="productName" v-model="originalProductData.productName">
            </div
            ><span style="border: 1px solid #666; border-radius: 50%; background: #f5f5b9; cursor: pointer;" @click="productName = originalProductData.productName">&gt;&gt;</span
            ><div style="display: inline-block; width: 45%;"> <!--右-->
              <p>商品名<span style="color: red;" v-if="!productName">*</span>：</p>
              <input type="text" placeholder="productName" v-model="productName"><span style="color: red;" v-if="mustFilled === 'name'">此项必填</span>
            </div>
          </li>
          <li style="border-top: 1px solid #999;" :style="{background: productSeller === originalProductData.productSeller? '#b2e5b2' : '#ffdbdb'}">
            <div style="display: inline-block; width: 45%;"> <!--左-->
              <p>厂商：</p>
              <input type="text" disabled placeholder="productSeller" v-model="originalProductData.productSeller">
            </div
            ><span style="border: 1px solid #666; border-radius: 50%; background: #f5f5b9; cursor: pointer;" @click="productSeller = originalProductData.productSeller">&gt;&gt;</span
            ><div style="display: inline-block; width: 45%;"> <!--右-->
              <p>厂商：</p>
              <input type="text" placeholder="productSeller" v-model="productSeller">
            </div>
          </li>
          <li style="border-top: 1px solid #999;" :style="{background: successBase64Image.toString() === originalProductData.productImage.toString()? '#b2e5b2' : '#ffdbdb'}">
            <div style="display: inline-block; width: 45%;"> <!--左-->
              <p>商品图片：</p>
              <ul>
                <!--已输入个数-->
                <li>
                  <span>{{(originalProductData.productImage.length === 0)? '未上传任何图片' : '已上传成功'}}</span
                  ><span style="color: red;">{{originalProductData.productImage.length}}</span
                  ><span>张，</span>
                </li>
                <!--已输入部分-->
                <li style="display: inline-block;margin-left: 20px;position: relative;" v-for="(item, index) in originalProductData.productImage" :key="item[index]">
                  <img style="display: inline-block;width: 200px;height: 200px;border: 1px solid black;" v-bind:src="item" v-bind:alt="item">
                </li>
              </ul>
            </div
            ><span style="border: 1px solid #666; border-radius: 50%; background: #f5f5b9; cursor: pointer;" @click="successBase64Image = originalProductData.productImage.concat()">&gt;&gt;</span
            ><div style="display: inline-block; width: 45%;"> <!--右-->
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
                  <input type="file" style="opacity: 0;border: 1px solid red;width: 50px;height: 50px;position: absolute;right: 0;" v-on:change="uploadImage" accept="image/*"> <!-- 仅支持所有图片文件 -->
                  <span style="display: inline-block;border: 1px solid black;padding: 0 12px;font-size: 42px;">+</span>
                </li>
              </ul>
            </div>
          </li>
          <li style="border-top: 1px solid #999;" :style="{background: productDetails === originalProductData.productDetails? '#b2e5b2' : '#ffdbdb'}">
            <div style="display: inline-block; width: 45%;"> <!--左-->
              <p>详情：</p>
              <input type="text" disabled placeholder="productDetails" v-model="originalProductData.productDetails">
            </div
            ><span style="border: 1px solid #666; border-radius: 50%; background: #f5f5b9; cursor: pointer;" @click="productDetails = originalProductData.productDetails">&gt;&gt;</span
            ><div style="display: inline-block; width: 45%;"> <!--右-->
              <p>详情：</p>
              <input type="text" placeholder="productDetails" v-model="productDetails">
            </div>
          </li>
          <li style="border-top: 1px solid #999;" :style="{background: productColor === originalProductData.productColor? '#b2e5b2' : '#ffdbdb'}">
            <div style="display: inline-block; width: 45%;"> <!--左-->
              <p>颜色：</p>
              <input type="text" disabled placeholder="productColor" v-model="originalProductData.productColor">
            </div
            ><span style="border: 1px solid #666; border-radius: 50%; background: #f5f5b9; cursor: pointer;" @click="productColor = originalProductData.productColor">&gt;&gt;</span
            ><div style="display: inline-block; width: 45%;"> <!--右-->
              <p>颜色：</p>
              <input type="text" placeholder="productColor" v-model="productColor"
              ><span style="margin-left: 6px; color: green; font-size: 14px;" v-if="productColor !== '' && serverColorData.indexOf(productColor) === -1">新颜色</span>
              <br>
              <button style="width: 60px; height: 24px; margin: 2px 5px;" v-for="(color, index) in serverColorData" :key="color.value" :title="index + 1" @click="productColor = color" v-if="color !== ''">{{color}}</button>
            </div>
          </li>
          <li style="border-top: 1px solid #999;" :style="{background: productGenre === originalProductData.productGenre? '#b2e5b2' : '#ffdbdb'}">
            <div style="display: inline-block; width: 45%;"> <!--左-->
              <p>分类：</p>
              <input type="text" disabled placeholder="productGenre" v-model="originalProductData.productGenre">
            </div
            ><span style="border: 1px solid #666; border-radius: 50%; background: #f5f5b9; cursor: pointer;" @click="productGenre = originalProductData.productGenre">&gt;&gt;</span
            ><div style="display: inline-block; width: 45%;"> <!--右-->
              <p>分类：</p>
              <input type="text" placeholder="productGenre" v-model="productGenre"
              ><span style="margin-left: 6px; color: green; font-size: 14px;" v-if="productGenre !== '' && serverGenreData.indexOf(productGenre) === -1">新分类</span>
              <br>
              <button style="width: 60px; height: 24px; margin: 2px 5px;" v-for="(genre, index) in serverGenreData" :key="genre.value" :title="index + 1" @click="productGenre = genre" v-if="genre !== ''">{{genre}}</button>
            </div>
          </li>
          <li style="border-top: 1px solid #999;" :style="{background: JSON.stringify(productSpecifications) === JSON.stringify(originalProductData.productSpecifications)? '#b2e5b2' : '#ffdbdb'}">
            <div style="display: inline-block; width: 45%;"> <!--左-->
              <p>商品规格：</p>
              <div>
                <span>所有规格：</span
                ><input type="text" disabled :placeholder="ruleAddition(originalProductData.productSpecifications)"
                ><span>总数（条）：</span
                ><input type="number" disabled :placeholder="addition(originalProductData.productSpecifications)">
              </div>
              <div v-for="(item, index) in originalProductData.productSpecifications" :key="item.size[index]">
                <span>尺码{{index + 1}}：</span
                ><input type="text" disabled v-model="item.size" v-on:blur="countProductSize"
                ><span>数量（条）：</span
                ><input type="number" disabled v-model="item.number" v-on:blur="countProductSum">
              </div>
            </div
            ><span style="border: 1px solid #666; border-radius: 50%; background: #f5f5b9; cursor: pointer;" @click="productSpecifications = $jsfn.fnArrayDeepCopy(originalProductData.productSpecifications); ruleSizes = ruleAddition(originalProductData.productSpecifications); productSum = addition(originalProductData.productSpecifications)">&gt;&gt;</span
            ><div style="display: inline-block; width: 45%;"> <!--右-->
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
          </li>
          <li style="border-top: 1px solid #999;" :style="{background: productOriginalPrice === originalProductData.productOriginalPrice? '#b2e5b2' : '#ffdbdb'}">
            <div style="display: inline-block; width: 45%;"> <!--左-->
              <p>进价（元）：</p>
              <input type="number" disabled placeholder="productOriginalPrice" v-model="originalProductData.productOriginalPrice">
            </div
            ><span style="border: 1px solid #666; border-radius: 50%; background: #f5f5b9; cursor: pointer;" @click="productOriginalPrice = originalProductData.productOriginalPrice">&gt;&gt;</span
            ><div style="display: inline-block; width: 45%;"> <!--右-->
              <p>进价（元）：</p>
              <input type="number" placeholder="productOriginalPrice" v-model="productOriginalPrice">
            </div>
          </li>
          <li style="border-top: 1px solid #999;" :style="{background: productBatchPrice === originalProductData.productBatchPrice? '#b2e5b2' : '#ffdbdb'}">
            <div style="display: inline-block; width: 45%;"> <!--左-->
              <p>批量售价（元）：</p>
              <input type="number" disabled placeholder="productBatchPrice" v-model="originalProductData.productBatchPrice">
            </div
            ><span style="border: 1px solid #666; border-radius: 50%; background: #f5f5b9; cursor: pointer;" @click="productBatchPrice = originalProductData.productBatchPrice">&gt;&gt;</span
            ><div style="display: inline-block; width: 45%;"> <!--右-->
              <p>批量售价（元）：</p>
              <input type="number" placeholder="productBatchPrice" v-model="productBatchPrice">
            </div>
          </li>
          <li style="border-top: 1px solid #999;" :style="{background: productSoloPrice === originalProductData.productSoloPrice? '#b2e5b2' : '#ffdbdb'}">
            <div style="display: inline-block; width: 45%;"> <!--左-->
              <p>零售价（元）：</p>
              <input type="number" disabled placeholder="productSoloPrice" v-model="originalProductData.productSoloPrice">
            </div
            ><span style="border: 1px solid #666; border-radius: 50%; background: #f5f5b9; cursor: pointer;" @click="productSoloPrice = originalProductData.productSoloPrice">&gt;&gt;</span
            ><div style="display: inline-block; width: 45%;"> <!--右-->
              <p>零售价（元）：</p>
              <input type="number" placeholder="productSoloPrice" v-model="productSoloPrice">
            </div>
          </li>
          <li style="border-top: 1px solid #999;" :style="{background: productExplain === originalProductData.productExplain? '#b2e5b2' : '#ffdbdb'}">
            <div style="display: inline-block; width: 45%;"> <!--左-->
              <p>备注：</p>
              <input type="text" disabled placeholder="productExplain" v-model="originalProductData.productExplain">
            </div
            ><span style="border: 1px solid #666; border-radius: 50%; background: #f5f5b9; cursor: pointer;" @click="productExplain = originalProductData.productExplain">&gt;&gt;</span
            ><div style="display: inline-block; width: 45%;"> <!--右-->
              <p>备注：</p>
              <input type="text" placeholder="productExplain" v-model="productExplain">
            </div>
          </li>
        </ul>
        <br><button @click="addGoods" v-if="goodsId === 'add'">提交</button>
        <br><button @click="addGoods" v-if="goodsId !== 'add'">确认修改</button>
        <!--<img style="display: inline-block; width: 100px; height: 100px;" v-for="image in uploadSuccessImage" :key="image" v-bind:src="image" alt="">-->
        <!--<input type="file" @change="testUploadImage">-->
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
      productData: {}, // 商品数据（新商品数据）
      originalProductData: { // 原始商品数据（修改商品时使用）
        productId: '', // 商品号(若是一号多色，要加上颜色)
        productName: '', // 商品名
        productNameFirstSpell: '', // 品名首拼（生成）
        productNameFullSpell: '', // 品名全拼（生成）
        productSeller: '', // 厂商
        productImage: '', // 商品图片 ---------------------------
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
        exist: true // 是否存在（删除时使用）
      },
      goodsId: 'add', // 判断本页该执行的操作 （商品_id）
      successBase64Image: [], // 展示的图片数量
      uploadNum: 1, // 上传的图片数量
      deleteImgBtn: false, // 图片删除按钮显示决定变量
      mustFilled: false, // 是否已填写所有必填项
      uploadSuccessImage: [], // 上传成功的图片数组
      serverColorData: [], // 数据库中颜色字段的所有数据
      serverGenreData: [], // 数据库中分类字段的所有数据
      ruleSizes: '', // 所有规格放在一起的字符串
      productSum: 0, // 商品总数
      searchData: { // 商品筛选条件 （统一请求中参数的发送）
        _id: '', // 商品_id
        id: '',
        name: ''
      }
    }
  },
  created () {
    var cvm = this
    // 获取标签（数据库中已有的字段值）
    cvm.getTitleMsg()
    cvm.goodsId = cvm.$route.query._id
    cvm.searchData._id = cvm.$route.query._id
    // this.originalProductData = this.$route.params.data // 通过路由传来的商品信息
    cvm.getProductByGoodsId()
  },
  computed: {
    arrangeUpdateValue () { // 调整整合修改值
      return function (originData, newData) {
        return originData === newData ? true : newData
      }
    },
    allNewProductData () {
      this.productId
      this.productName
      console.log(this)
      return Date.now()
    }
  },
  watch: {
    '$route' () { // 监听路由参数的变化
      var wvm = this
      wvm.getTitleMsg()
      wvm.goodsId = wvm.$route.query._id // 路由参数_id改变则影响页面显示
    },
    'productId' () {
      console.log('改变')
      this.searchData.id = this.arrangeUpdateValue(this.originalProductData.productId, this.productId)
    },
    allNewProductData () {
      console.log('监控所有修改')
    }
  },
  mounted () {
    // this.$windowFn.allWindow('AddNewGoods', 'warning', '内容', '确定') // 测试 调用警告弹窗
  },
  methods: {
    /*
    * 获取函数
    * */
    // 获取标签（数据库中已有的字段值）
    getTitleMsg () {
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

    // 通过_id获取商品数据
    getProductByGoodsId () {
      this.$sendRequest.RTSPost('/rm_goods/goods_by_searchData', {userId: '获取用户Id', searchData: this.searchData}).then(res => {
        if (res.data.code === 0) {
          this.originalProductData = res.data.data
          console.log(this.originalProductData)
        }
      })
    },

    /*
    * 本页函数
    * */
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
          this.$windowFn.allWindow('AddNewGoods', 'remind', '已上传此图片，不需要再传了', {agree: '晓得了', cancel: ''}) // 调用提示弹窗
        }
      }
      // var res = this.$sendRequest.RTSPost('/rm_upload_image/upload', '123')
      // console.log(res);

      // 此图片上传成功后收到地址并push进successImage中
      // this.successBase64Image.push(file)
      console.log('this.successBase64Image', this.successBase64Image, typeof this.successBase64Image, this.originalProductData.productImage)
      event.target.value = '' // 重置上传按钮的value值避免不能上传重复图片
    },

    // 分散分配规格数据
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
      console.log(typeof this.productSpecifications, typeof this.originalProductData.productSpecifications)
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
          this.productData.productNameAddId = this.productName + this.productId // 商品名+id
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
            if (res.data.code === 0) {
              // console.log('提交成功');
              this.uploadSuccessImage = res.data.image
              this.$windowFn.allWindow( // 触发弹窗函数以提醒用户
                'AddNewGoods',
                'congratulations',
                {
                  text: '已成功添加' + this.productName + this.productId + '商品',
                  image: res.data.image
                },
                {agree: '查看商品', cancel: '继续添加'},
                true
              ).then(e => {
                if (e.code === 0) {
                  console.log('查看商品')
                  this.$router.push({name: 'GoodsList'}) // 转到商品展示列表GoodsList.vue
                } else if (e.code === 1) {
                  console.log('继续添加')
                  // 清空页面值
                  this.productId = '' // 商品号(若是一号多色，要加上颜色)
                  this.productName = '' // 商品名
                  this.productSeller = '' // 厂商
                  this.successBase64Image = [] // 商品图片
                  this.productDetails = '' // 商品详情
                  this.productColor = '' // 商品颜色
                  this.productSpecifications = [ // 商品规格
                    {size: '', number: 0}
                  ]
                  this.productGenre = '' // 商品分类
                  this.productOriginalPrice = 0 // 商品进价
                  this.productBatchPrice = 0 // 商品批量售价
                  this.productSoloPrice = 0 // 商品零售价
                  this.productExplain = '暂无' // 商品备注
                }
              })
            } else {
              console.log('提交失败')
            }
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
      this.$windowFn.allWindow('AddNewGoods', 'warning', '确定删除此图片吗？', {agree: '确定', cancel: '取消'}, true).then((e) => {
        console.log('父元素收到返回值打印', e)
        if (e.code === 0) {
          this.successBase64Image.splice(index, 1)
        }
      })
      // console.log('结束？')
    },

    // 商品总数计算
    addition (addendArray) {
      var num = 0
      if (typeof addendArray === 'object') {
        addendArray.forEach(e => {
          if (typeof e.number === 'number') {
            num += e.number
          } else {
            num = '数据错误'
          }
        })
      } else {
        console.log('数据错误')
      }
      return num
    },

    // 商品规格值计算
    ruleAddition (ruleArray) {
      var origRuleSizes = ''
      ruleArray.forEach((e, index) => {
        if (index < ruleArray.length - 1) {
          origRuleSizes += e.size + ','
        } else {
          origRuleSizes += e.size
        }
      })
      return origRuleSizes
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
    },
    testUploadImage (event) {
      let file = event.target.files[0]
      console.log(event)
      console.log(event.target.files[0].size / 1024 / 1024)
      let reader = new FileReader()
      // var xhr = new XMLHttpRequest()
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
          this.$windowFn.allWindow('AddNewGoods', 'remind', '已上传此图片，不需要再传了', {agree: '晓得了', cancel: ''}) // 调用提示弹窗
        }
        event.target.value = '' // 重置上传按钮的value值避免不能上传重复图片
      }
    },
    concatTest () {
      // var a = [1, 2, 3]
      // var b = a
      // a[0] = 0
      // console.log(a, b)
      // ---------------------------------------------------------
      console.log(this.productSpecifications, this.originalProductData.productSpecifications)
      this.productSpecifications = JSON.parse(JSON.stringify(this.originalProductData.productSpecifications))

      this.productSpecifications[1].number = 2
      console.log(this.productSpecifications, this.originalProductData.productSpecifications)
      console.log(this.productSpecifications)

      var deepCopy = function (obj) {
        if (typeof obj !== 'object') return
        var newObj = obj instanceof Array ? [] : {}
        for (var key in obj) {
          console.log('数组', key, obj)
          if (obj.hasOwnProperty(key)) {
            newObj[key] = typeof obj[key] === 'object' ? deepCopy(obj[key]) : obj[key]
            console.log('成功', key, obj)
          } else {
            console.log('失败', key, obj)
          }
        }
        return newObj
      }
      var a = [1, {x: 25, y: {z: 23, w: 28}}, 3]
      var b = this.$jsfn.fnArrayDeepCopy(a)
      b[1].y.z = 78
      console.log('b', a, b)
    }
  }
}
</script>

<style scoped lang="less">

</style>
