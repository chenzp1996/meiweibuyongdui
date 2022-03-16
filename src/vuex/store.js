import Vue from 'vue'
import Vuex from 'vuex'
import * as getters from './getters'
import * as mutations from './mutations'
import * as actions from './actions'

Vue.use(Vuex)

const store = new Vuex.Store({
    //定义状态
    state:{
        is_login: false,    //登录状态
        user_id: '',    //用户id
        // vuex的特性 刷新时会自动将state指控，导致数据丢失，保存在本地缓存可以解决该问题
        totalShopList: JSON.parse(sessionStorage.getItem("shop_list")) || []   //商家列表
    },
    getters,
    mutations,
    actions
})

export default store