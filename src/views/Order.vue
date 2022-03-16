<template>
    <div class="page-tabbar">
        <div class="page-wrap">
            <van-nav-bar
                title="我的订单"
                left-text="返回"
                right-text=""
                left-arrow
                @click-left="goback()"
                @click-right="onClickRight()"
                class="nav-bar"
            />
            <p class="title"></p>
            <div class="no-order" v-if="!is_login">
                您还没有登陆...
                <router-link class="go-to-shop" to="/login">立即登陆</router-link>
            </div>
            <div class="no-order" v-else-if="!shopList || !is_login">
                您还没有预约订座...
                <router-link class="go-to-shop" to="/shop">立即预约</router-link>
            </div>
            <div v-else class="order-wraper">
                <van-tabs v-model="active">
                    <van-tab title="排队订单">
                        <van-card v-for="(item, index) in shopList" v-show="item.type == 0" :key="index"

                            :desc="`预约人数:${item.peopleNum}人`"
                            currency=""
                            :title="item.shop_id.name"
                            :thumb="item.shop_id.frontImg"
                            >
                            <div slot="tags" class="card_tags">
                                <van-tag v-if="item.status == 0" plain type="danger">排队中</van-tag>
                                <van-tag v-else-if="item.status == 1" plain type="danger">已取号</van-tag>
                                <van-tag v-else-if="item.status == 2" plain type="danger">已完成</van-tag>
                            </div>
                            <div slot="footer">
                                <p v-if="item.rowNumber != 0" class="creat-time">排号：{{item.rowNumber}}</p>
                                <p class="creat-time">订单时间：{{item.createTime}}</p>
                                <van-button size="small" @click="goToShop(item.shop_id._id)">查询商家</van-button>
                                <van-button v-show="item.status != 2" size="small" @click="cancleOrder(item.user_id,item.shop_id._id)">取消预定</van-button>
                                
                            </div>
                        </van-card>
                    </van-tab>
                    <van-tab title="预约订单">
                        <van-card v-for="(item, index) in shopList" v-show="item.type == 1" :key="index"
                        :tag="item.status == 0 ? '待接单' : item.status == 1 ? '已接单' : '已完成'"
                        :desc="`预约人数:${item.peopleNum}人`"
                        :price="item.eatTime ? `到店时间:${item.eatTime}` : ``"
                        currency=""
                        :title="item.shop_id.name"
                        :thumb="item.shop_id.frontImg"
                        >
                        <div slot="tags" class="card_tags">
                            <van-tag v-show="item.status != 2" plain type="danger">
                                预约中
                            </van-tag>
                        </div>
                        <div slot="footer">
                            <p v-if="item.rowNumber != 0" class="creat-time">排号：{{item.rowNumber}}</p>
                            <p class="creat-time">订单时间：{{item.createTime}}</p>
                            <van-button size="small" @click="goToShop(item.shop_id._id)">查询商家</van-button>
                            <van-button v-show="item.status != 2" size="small" @click="cancleOrder(item.user_id,item.shop_id._id)">取消预定</van-button>
                        </div>
                    </van-card>
                    </van-tab>
                </van-tabs>
            </div>
            <bottom-tabbar></bottom-tabbar>
        </div>
    </div>
</template>
 
<script>
import Vue from 'vue'
import Cookies from 'js-cookie'
import BottomTabbar from '../components/BottomTabbar'

export default {
    name: 'Order',
    data() {
        return {
            active: 0,
            value: '',
            is_login: Cookies.get('is_login') || this.$store.state.is_login ||'',
            user_id:  localStorage.getItem('user_id') || '',
            shopList:[]
        };
    },
    props:{
        
    },
    components: {
        'bottom-tabbar': BottomTabbar
    },
    computed: {
        isLogin(){
            let user_id = Cookies.get('user_id'),
                is_login = Cookies.get('is_login');
            if(user_id && is_login){
                this.avatar = localStorage.getItem("avatar");
                this.$store.commit('userStatus',user_id)
            }else{
                this.$store.commit('userStatus',null)
            }
            return this.$store.getters.is_login;
        }
    },
    created() {
        this.getShopData();
    },
    methods: {
        onSearch(){
            console.log('搜索店铺功能')
        },
        getShopData(){
            // console.log(user_id)
            let user_id = this.user_id || '';
            if(!user_id){
                this.$toast('请先登录账号！');
                setTimeout(()=>{
                        this.$router.push('/login')
                },2000)
                return;
            }
            Vue.axios.get('/api/order',{
                params:{
                    user_id:user_id
                }
            }).then((res) => {
                var res = res.data;
                if(res.code == 2){
                    this.$toast(res.tips);
                }
                this.shopList = res.result;
                console.log(this.shopList)
            })
        },
        //取消预约
        cancleOrder(user_id,shop_id){
            this.$dialog.confirm({
                title: '确定取消该订单吗？',
                }).then(() => {
                    Vue.axios.get('/api/order/delete',{
                        params:{
                            user_id,
                            shop_id
                        }
                    }).then((res) => {
                        var res = res.data;
                        if(res){
                            console.log(res)
                            this.$toast(res.tips);
                            this.getShopData();

                            if(res.code == 0){
                                //当前用户加入到socket room
                                this.$socket.emit('join', {id:user_id})
                                //向指定店铺发送订单
                                this.$socket.emit('cancle', {code:0,tips:'取消成功',shop_id:shop_id})
                            }
                           
                        }
                    })
                }).catch(() => {
            });
            
        },
        //查看商家详情
        goToShop(shop_id){
            this.$router.push('/shop/detail?shop_id=' + shop_id)
        },
        goback(){
            this.$router.go(-1);
            this.data.active = 0;
        },
        onClickRight(){

        }

    },
};
</script>
 
<style scoped lang="less">
.page-tabbar{
    overflow: hidden;
}
.title{
    text-align: center;
    color: #999;
    font-size:36px;
}
.no-order{
    text-align: center;
    color: #999;
    margin-top: 20px;
    .go-to-shop{
        display: block;
        color: #3497FB;
    }
}
.van-card{
    margin-top:10px;
}
.creat-time{
    text-align: left;
    margin-bottom: 10px;
}


</style>
