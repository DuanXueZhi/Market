import Vue from 'vue'
import Router from 'vue-router'
/*
* 主页
* */
import Home from '@/page/Home'
import AddNewGoods from '@/components/Home/AddNewGoods'
/*
* 列表展示
* */
import ListShow from '@/page/ListShow'
import GoodsList from '@/components/ListShow/GoodsList'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: 'Home'
    },
    // 主页
    {
      path: '/Home',
      name: 'Home',
      component: Home,
      children: [
        {
          path: 'AddNewGoods',
          name: 'AddNewGoods',
          component: AddNewGoods
        }
      ]
    },
    // 列表展示
    {
      path: '/ListShow',
      name: 'ListShow',
      component: ListShow,
      children: [
        {// 商品列表
          path: 'GoodsList',
          name: 'GoodsList',
          component: GoodsList
        }
      ]
    }
  ]
})
