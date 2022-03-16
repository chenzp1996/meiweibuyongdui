import Vue from 'vue';
//唯一能修改状态的方法
export const userStatus = (state, user_id) => {
    if(user_id){
        state.user_id = user_id,
        state.is_login = true
    }else{
        //登出，清空cookie
        Cookies.remove('user_id');
        Cookies.remove('is_login');
        state.user_id = '';
        state.is_login = false;
    }
}

export const getShopList = (state) => {
    let getShopData = ()=>{
        Vue.axios.get('/api/shop').then((res) => {
            sessionStorage.setItem('shop_list', JSON.stringify(res.data.shopList));
            state.totalShopList = res.data.shopList;
        })
    }
    getShopData();
}