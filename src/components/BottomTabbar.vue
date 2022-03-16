<template>
  <div id="tabbar">
    <!-- 底部导航栏 -->
    <van-tabbar
        v-model="active"
        fixed
        animated
        >
        <van-tabbar-item icon="home-o" @click="getPage('index')">首页</van-tabbar-item>
        <van-tabbar-item icon="shop-collect" @click="getPage('shop')">附近</van-tabbar-item>
        <van-tabbar-item icon="bar-chart-o" @click="getPage('order')">订单</van-tabbar-item>
        <van-tabbar-item icon="user-circle-o" @click="getPage('home')">我的</van-tabbar-item>
    </van-tabbar>
    <div style="height:50px"></div>    
  </div>
</template>

<script>
export default {
    name:"",
    data() {
        return {
            active : 0
        }
    },
    created() {
        this.bottomFixBar();
    },
    methods: {
        getPage(path){
            switch(path){
                case 'index': this.$router.push({ path: '/index' });break;
                case 'shop': this.$router.push({ path: '/shop' });break;
                case 'order': this.$router.push({ path: '/order' });break;
                case 'home': this.$router.push({ path: '/home' });break;
                default: break;
            }
        },
        // 页面加载根据路由判断底部导航栏颜色
        bottomFixBar(){
            switch(location.pathname.split('/')[1]){
                case 'index': this.active = 0;break;
                case 'shop': this.active = 1;break;
                case 'order': this.active = 2;break;
                default: this.active = 3;
            }
        }  
    },
}
</script>

<style scope>

</style>
