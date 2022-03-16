<template>
    <div class="page-tabbar">
        <div class="page-wrap">
            <van-nav-bar
                title="附近餐厅"
                left-text="返回"
                left-arrow
                @click-left="goback()"
                @click-right="onLocation()"
                class="nav-bar"
            >
                <van-icon name="location-o" slot="right" />
            </van-nav-bar>
            <!-- 子路由list、detail出口 -->
            <router-view/>
        </div>
        <bottom-tabbar></bottom-tabbar>
    </div>
</template>
 
<script>
import Vue from 'vue';
import BottomTabbar from '../components/BottomTabbar';

export default {
    name: '',
    
    data() {
        return {
            active: 0,
            value: '',
            imageURL: '../../static/img/index-shop/1.jpg',
            shopList:[]
        };
    },
    props:{
        
    },
    components: {
        'bottom-tabbar': BottomTabbar
    },
    computed: {
         
    },
    created() {
        this.resList = function(){
            showWhich(value)
        }
        // this.getShopData();
        // console.log(this.shopList)
    },
    methods: {
        
        goback(){
            this.$router.go(-1);
            // this.data.active = 0;
        },
        onLocation(){
            console.log("定位功能")
        },
        getShopData(){
            Vue.axios.get('/api/shop').then((res) => {
                this.shopList = res.data.shopList;
                // console.log(this.shopList)
            })
        },
    },
};
</script>
 
<style scoped lang="less">
.page-tabbar{
    overflow: hidden;
}

.van-nav-bar__text{
    color: #000;
    .van-icon-arrow-left:before{
        color: #000;
    }
}
.nav-bar{
    color: #000;
}


</style>
