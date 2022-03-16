<template>
  <div class="wraper">
        <van-list v-model="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="onLoad">
            <van-cell class="shop-wraper" v-for="(item, index) in shopList" :key="index">
                <div class="restaurant">
                    <van-row type="flex" justify="center">
                        <van-col span="8">
                            <a class="frontImg" href="">
                                <img :src="item.frontImg" alt="店铺照片"/>
                            </a>
                        </van-col>
                        <van-col span="16" class="text-container">
                            <router-link class="desc" :to="{path:'/shop/detail',query:{shop_id:item._id}}">
                                <h6 class="resName">{{item.name}}</h6>
                                <p class="avg-price">￥{{item.avgPrice}}/人</p>
                                <div>
                                    <van-icon color="#FBBA2C" name="star" v-for="(item, index) in item.avgScore" :key="index"/>
                                </div>
                            </router-link>
                        </van-col>
                    </van-row>
                    <p class="address"><van-icon color="RGB(130,191,252)" name="location" />地址：{{item.address}}</p>
                </div>
            </van-cell>
        </van-list>
  </div>
</template>

<script>
import Vue from 'vue';
import { mapState } from 'vuex'

export default {
    name:'CommenShopBlock',
    props:['type'],
    data() {
        return {
            num: 0, //初始加载商家数量
            loading: false,
            finished: false,
            shopList:[]
            // toastClose: '',
            // someRes: [], //筛选出的商家

        }
    },
    computed: {
        ...mapState({
            totalShopList: state => state.totalShopList
        }),
        totalShopListType:{
            get (){
                return this.$store.state.totalShopList
            },
            set (val){
                this.$store.state.totalShopList = val
            }
        }   
    },
    created() {
        this.getShopData();
    },
    mounted() {
        
    },

    methods: {
         getPage(){
            //  :to="`/shop/detail?shop_id=${item._id}`"
             this.$router.push ({ path: '/shop/detail/1111' })
         },

        //使用vuex全局共享totalShopList
        getShopData(){
            this.$store.dispatch("setShopList");
            // Vue.axios.get('/api/shop').then((res) => {
            //     this.totalShopList = res.data.shopList;
            //     console.log(this.totalShopList)
            // })
        },
        onLoad() {
            // 异步更新数据
            setTimeout(() => {
                if(this.num<this.totalShopList.length){
                    for (let i = 0; i < 5; i++) {
                        this.num++;
                        let shop = this.totalShopList[this.num]
                        if(shop){
                            // console.log(shop);
                            switch(this.type){
                                case 'all': 
                                    this.shopList.push(shop);
                                    break;
                                case 'star': 
                                    if(shop.avgScore == 5){
                                        this.shopList.push(shop);
                                        break;
                                    }
                                break;
                                case 'price':
                                    this.shopList.push(shop);
                                    break;
                                
                            }
                            
                        }
                    }
                }
                this.loading = false;
                if(this.num>=this.totalShopList.length){
                    this.finished = true;
                }
            }, 500); 
            
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
    .container{
    padding: 0;
    background: #EFEFF4;
    }
    .row{
        margin: 0;
    }
    .title{
        font-size: 16px;
        font-weight: bold;
    }
    .shop-wraper{
        border-top:2px solid #EFEFF4;  
    }
    .restaurant{
        padding-bottom: 10px;
        // border: 2px solid rgba(25, 137, 250, 0.8);
        
        img{
            padding: 5px;
            border-radius: 10px;
            box-sizing: border-box;
        }

    } 

    .desc{
        color: #333;
        display: inline-block;
    }
    .avg-price{
        font-size: 12px;
    }

    .text-container{
        box-sizing: border-box;
        padding: 10px 15px;
    }

    .address{
        margin-top: 10px;
        padding-left: 10px;
        font-size: 14px;
        line-height: 14px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

</style>
