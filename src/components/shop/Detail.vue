<template>
    <div class="detail-wrapper">
        <div class="info">
            <van-row type="flex" justify="center">
                <van-col span="8">
                    <img class="frontImg" :src="shopInfo.frontImg" alt="店铺照片"/>
                </van-col>
                <van-col span="16" class="text-container">
                    <div class="desc" >
                        <h6 class="resName">{{shopInfo.name}}</h6>
                        <div class="star">
                            <van-icon color="#FBBA2C" name="star" v-for="(item, index) in shopInfo.avgScore" :key="index"/>
                        </div>
                    </div>
                    <van-icon v-if="shopInfo.isOpen" class="status" size="20px" color="RGB(130,191,252)" name="passed" />
                    <van-icon v-else class="status" size="20px" name="close" />
                </van-col>
               
            </van-row>
        </div>

        <!-- 预约排队功能按钮 -->
            <van-row class="btn-wraper">
                <van-col span="8" offset="4"><van-button type="primary" @click="setQueueFormShow(true)" class="btn btn-paidui" >排队取号</van-button></van-col>
                <van-col span="8" offset="2"><van-button type="primary" @click="setOrderFormShow(true)" class="btn btn-yuyue">预约订座</van-button></van-col>
            </van-row>

        <div class="box">
            <p class="title">
                <van-icon name="underway" color='#FF4444'/>
                <span>排队取号</span>
            </p>
            <van-cell :value="queueNum.sNum" icon="shop-o">
                <template slot="title">
                    <span class="custom-text">前面小桌</span>
                    <van-tag type="danger">1~2人</van-tag>
                </template>
            </van-cell>
            <van-cell :value="queueNum.mNum" icon="shop-o">
                <template slot="title">
                    <span class="custom-text">前面中桌</span>
                    <van-tag type="danger">3~4人</van-tag>
                </template>
            </van-cell>
            <van-cell :value="queueNum.lNum" icon="shop-o">
                <template slot="title">
                    <span class="custom-text">前面大桌</span>
                    <van-tag type="danger">5人以上</van-tag>
                </template>
            </van-cell>
        </div>
        <div class="box">
            <p class="title">
                <van-icon name="send-gift" color='#FF4444'/>
                <span>预约订座</span>
            </p>
            <van-cell :value="orderNum" icon="shop-o">
                <template slot="title">
                    <span class="custom-text">已预约</span>
                </template>
            </van-cell>
        </div>

         <div class="box">
            <p class="title">
                <van-icon name="shop-collect" color='#FF4444'/>
                <span>更多信息</span>
            </p>
            <van-cell :title="shopInfo.phone" is-link icon="phone"/>
            <van-cell :title="shopInfo.address" is-link icon="location"/>
            <van-cell :title="`营业时间：${shopInfo.openTime}`" is-link icon="clock"/>
        </div>

        <van-popup v-model="OrderFormShow" position="bottom" :overlay="true">
            <OrderForm @setOrderFormShow="setOrderFormShow" @fetchShopOrderNum='fetchShopOrderNum'/>
        </van-popup>

        <van-popup v-model="queueFormShow" position="bottom" :overlay="true">
            <QueueForm @setQueueFormShow="setQueueFormShow" @fetchShopOrderNum='fetchShopOrderNum'/>
        </van-popup>
        
    </div>
</template>
 
<script>
import Vue from 'vue';
import OrderForm from "../OrderForm.vue" //预约模块
import QueueForm from "../QueueForm.vue" //预约模块

export default {
    name: 'Detail',
    components:{
        OrderForm,
        QueueForm
    },
    data() {
        return {
            shopInfo:{},
            OrderFormShow:false,    //预约信息填写表单
            queueFormShow:false,    //排队信息填写表单
            queueNum:{  //当前排队桌数情况，小桌QueueNum[0]，中桌QueueNum[1]，大桌QueueNum[2]
                sNum:0,
                mNum:0,
                lNum:0,
            },       
            orderNum:0,              //当前订座桌数情况
        };
    },
    props:{
        
    },
    computed: {
         
    },
    created() {
        this.getShopData();
    },
    mounted() {
        this.fetchShopOrderNum();
    },
    methods: {
        //根据shop_id获取该商家的信息
        getShopData(){
             Vue.axios.get('/api/shop/detail',{
                 params:{
                     shop_id:this.$route.query.shop_id
                 }
             }).then((res) => {
                this.shopInfo = res.data;
            })
        },
        setOrderFormShow(bool){
            this.OrderFormShow = bool;
        },
        setQueueFormShow(bool){
            this.queueFormShow = bool;
        },
        //获取不同类型排队/订座已有数量
        fetchShopOrderNum(){
            Vue.axios.get('/api/morder',{
                params:{
                    shop_id:this.$route.query.shop_id
                }
                })
                .then((res) => {
                    let {orderData} = res.data;
                    console.log(orderData)
                    //有订单数据
                    if(orderData && orderData.length > 0){
                        orderData.map((item,index)=>{
                            if(item.type == 0){ //0为排队类
                                if(item.peopleNum <= 2){
                                    this.queueNum.sNum++;
                                }else if(item.peopleNum > 2 && item.peopleNum <= 4){
                                    this.queueNum.mNum++;
                                }else{
                                    this.queueNum.lNum++;
                                }
                            }else if(item.type == 1){  //1为订座类
                                this.orderNum++;
                            }
                        })
                    }
                }).catch((err)=>{
                    console.log(err)
                })
        }
    },
};
</script>
 
<style scoped lang="less">
.detail-wrapper{
    .info{
            padding:10px 20px;
            margin-bottom: 20px;
            border-bottom: 5px solid rgb(204, 205, 207);
            // background-image: linear-gradient(-90deg, rgba(148, 127, 127, 0.596) 0%, #202935 100%);
        .frontImg{
            border-radius: 10px;
        }
        .text-container{
            margin-left: 20px;
            position: relative;
            .desc{
                position: absolute;
                top: 0;
                bottom: 0;
                transform: translate(0,25%);
                // vertical-align: middle;
                h6{
                    font-size: 14px;
                }
                .star{
                    margin-top: 5px;
                }
            }
            .status{
                width: 20px;
                height: 20px;
                position: absolute;
                bottom: 0;
                right: 20px;
            }
        }
        
    }
    .banner{
        width: 100%;
        height: 200px;
    }
    .btn-wraper{
        margin-top: 10px;
        padding: 10px 0;
    }

    .box{
        border-bottom: 2px solid #ccc;
    }
    .title{
        margin-top: 20px;
        display: flex;
        align-items: center;
        font-size: 16px;
        line-height: 20px;
        padding: 10px 15px;
        span{
            margin-left: 10px;
            color: #000;
        }
    }
    
}
</style>
