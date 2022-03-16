import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/views/Index'
import Shop from '@/views/Shop'
import Order from '@/views/Order'
import Home from '@/views/Home'
import Register from '@/views/Register'
import Login from '@/views/Login'
import ShopDetail from '@/components/shop/Detail'
import ShopList from '@/components/shop/List'

//商家内容
import MIndex from '@/views/merchant/Index'
import MLogin from '@/views/merchant/Login'

Vue.use(Router)

export default new Router({
    mode:"history",
    routes: [
        {
            path: '/',
            redirect: '/index'
        },
        {
            path: '/index',
            name: 'Index',
            component: Index
        },
        {
            path: '/shop',
            name: 'Shop',
            component: Shop,
            redirect:'/shop/list',
            children: [
                {
                    name:"ShopList",
                    path: 'list',
                    component: ShopList,
                },
                {
                    name:"ShopDetail",
                    path: 'detail',
                    component: ShopDetail,
                },
            ]
        },
        
        {
            path: '/order',
            name: 'Order',
            component: Order
        },
        {
            path: '/home',
            name: 'Home',
            component: Home
        },
        {
            path: '/register',
            name: 'Register',
            component: Register
        },
        {
            path: '/login',
            name: 'Login',
            component: Login
        },

// 商家路由
        {
            path: '/mindex',
            name: 'MIndex',
            component: MIndex,
        },
        {
            name:"Mlogin",
            path: '/mlogin',
            component: MLogin,
        },

    ]
})
