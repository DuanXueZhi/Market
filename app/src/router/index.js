import Vue from 'vue'
import Router from 'vue-router'
/*
* 主页
* */
import Home from '@/page/Home'
import AddNewGoods from '@/components/Home/AddNewGoods'
import AddNewPurchaseMsg from '@/components/Home/AddNewPurchaseMsg'
/*
* 列表展示 （本店信息展示）
* */
import ListShow from '@/page/ListShow'
import GoodsList from '@/components/ListShow/GoodsList'
import PurchasesList from '@/components/ListShow/PurchasesList'
/*
* 用户
* */
import User from '@/page/User'
import UserRegister from '@/components/User/UserRegister' // 用户注册界面（未完待续）
import UserPersonalCenter from '@/components/User/UserPersonalCenter' // 用户个人中心【默认界面】
import UserMsg from '@/components/User/UserMsg' // 管理员查看用户列表
import UsersList from '@/components/User/Admin/UsersList' // 管理员查看用户列表【admin】
import ChooseMyBoss from '@/components/User/assistant/ChooseMyBoss' // 店员选择店长【assistant】

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
        { // 添加商品（包括修改商品）
          path: 'AddNewGoods',
          name: 'AddNewGoods',
          component: AddNewGoods
        },
        { // 添加新的进货记录
          path: 'AddNewPurchaseMsg',
          name: 'AddNewPurchaseMsg',
          component: AddNewPurchaseMsg
        }
      ]
    },
    // 列表展示
    {
      path: '/ListShow',
      name: 'ListShow',
      component: ListShow,
      children: [
        { // 商品列表
          path: 'GoodsList',
          name: 'GoodsList',
          component: GoodsList
        },
        { // 进货列表
          path: 'PurchasesList',
          name: 'PurchasesList',
          component: PurchasesList
        }
      ]
    },
    // 用户
    { // 用户注册【单独设置路由，'/User'路由中】
      path: '/UserRegister',
      name: 'UserRegister',
      component: UserRegister
    },
    { // 【用户】
      path: '/User',
      name: 'User',
      component: User,
      children: [
        {
          path: '/User', // 使用‘/’会报警告【即:to="{name: 'User'}"时不会转到默认子路由（UserPersonalCenter）下】
          redirect: 'UserPersonalCenter'
        },
        { // 个人中心
          path: 'UserPersonalCenter',
          name: 'UserPersonalCenter',
          component: UserPersonalCenter
        },
        { // 用户个人信息
          path: 'UserMsg',
          name: 'UserMsg',
          component: UserMsg
        },
        { // 管理员查看用户【admin】
          path: 'UsersList',
          name: 'UsersList',
          component: UsersList
        },
        { // 店员选择店长【assistant】
          path: 'ChooseMyBoss',
          name: 'ChooseMyBoss',
          component: ChooseMyBoss
        }
      ]
    }
  ]
})
