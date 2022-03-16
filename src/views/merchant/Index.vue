<template>
    <div class="container">
        <div class="header">
            <div class="header-left">
                <h3 class="title">商家配置中心</h3>
            </div>
            <div class="header-right">
                <el-dropdown split-button @command="dropdownhandl">
                    {{shopInfo.name}}
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="0">退出登录</el-dropdown-item>
                    <el-dropdown-item command="1">我的资料</el-dropdown-item>
                </el-dropdown-menu>
                </el-dropdown>
            </div>
        </div>
        

        <div class="nav">
            <el-menu
            @open="handleSelect(1)"
            @close="handleSelect(1)"
            @select="handleSelect(1)"
            default-active="1-1"
            class="el-menu-vertical-demo"
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b">
            <el-submenu index="1">
                <template slot="title">
                    <i class="el-icon-setting"></i>
                    <span slot="title">订单管理</span>
                </template>
                <el-menu-item-group>
                    <el-menu-item index="1-1" @click="showSomeOrder(0)">全部订单</el-menu-item>
                </el-menu-item-group>
                <el-menu-item-group>
                    <el-menu-item index="1-2" @click="showSomeOrder(1)">待处理</el-menu-item>
                </el-menu-item-group>
                <el-menu-item-group>
                    <el-menu-item index="1-3" @click="showSomeOrder(2)">已处理</el-menu-item>
                </el-menu-item-group>
            </el-submenu>

            <el-menu-item
                index="2"
                @click="handleSelect(2)">
                <i class="el-icon-menu"></i>
                <span>数据中心</span>
            </el-menu-item>
            
            <el-menu-item 
                index="3" 
                @click="handleSelect(3)">
                <i class="el-icon-edit"></i>
                <span slot="title">我的店铺</span>
            </el-menu-item>
            </el-menu>
        </div>

        <div class="content">


            <el-table
            v-if="dataType == 1"
            :data="someOrderData"
            style="width: 100%"
            :row-class-name="tableRowClassName">
                <el-table-column
                    prop="createTime"
                    label="日期"
                    width="180"
                    align="center">
                </el-table-column>
                <el-table-column
                    prop="name"
                    label="姓名"
                    width="80"
                    align="center">
                </el-table-column>
                <el-table-column
                    prop="phone"
                    label="联系方式"
                    width="100"
                    align="center">
                </el-table-column>
                <el-table-column
                    prop="peopleNum"
                    label="到店人数"
                    width="80"
                    align="center">
                </el-table-column>
                <el-table-column
                    prop="eatTime"
                    label="到店时间"
                    width="180"
                    align="center">
                </el-table-column>
                <el-table-column
                    prop="rowNumber"
                    label="排号"
                    width="80"
                    :formatter="formatterRowNumber"
                    align="center">
                </el-table-column>
                <el-table-column
                    prop="status"
                    label="状态"
                    width="80"
                    align="center">
                    <template slot-scope="scope">
                        <el-tag
                        :type="scope.row.status === 0 ? 'danger' : scope.row.status === 1 ? 'primary' : 'success'"
                        disable-transitions>{{setStatus(scope.row.status)}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button
                        v-if="scope.row.status == 0"
                        size="mini"
                        type="primary"
                        @click="handleReceiveOrder(scope.$index, scope.row, 1)">接单</el-button>

                        <el-button
                        v-else-if="scope.row.status == 1"
                        size="mini"
                        type="primary"
                        @click="handleReceiveOrder(scope.$index, scope.row, 2)">完成</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <div v-else-if="dataType == 2">
                <Echarts :orderData="orderData"/>
            </div>

            <div v-else-if="dataType == 3">
                <div class="shop-image">
                    <img :src="shopInfo.frontImg">
                </div>
                <el-form ref="form" class="form-wrapper" :model="form" label-width="80px">
                    <el-form-item label="店铺名称">
                        <el-input v-model="shopInfo.name" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="店铺地址">
                        <el-input v-model="shopInfo.address" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="营业时间">
                        <el-input v-model="shopInfo.openTime" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="联系方式">
                        <el-input v-model="shopInfo.phone" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="店铺等级">
                        <el-input v-model="shopInfo.grade" :disabled="true">一级店铺</el-input>
                    </el-form-item>
                    <el-form-item label="店铺评价">
                        <el-rate
                        class="rate"
                        v-model="shopInfo.avgScore"
                        disabled
                        text-color="#ff9900"
                        score-template="{value}">
                        </el-rate>
                    </el-form-item>
                    
                    <el-form-item label="是否营业">
                        <el-switch v-model="form.delivery"></el-switch>
                    </el-form-item>
                </el-form>
            </div>
        </div>


    </div>
</template>

    

<script>    
import Vue from 'vue';
import Cookies from 'js-cookie'
import { getQueryFromUrl } from '../../utils/commenTool'
import Echarts from './Echarts.vue'

export default {
    components: { Echarts },
    data() {
        return {
            shopId : getQueryFromUrl('shop_id') || Cookies.get('shop_id'),
            is_mlogin : Cookies.get('is_mlogin'),
            shopInfo:{},
            orderData:[],
            someOrderData:[],
            dataType:1,

            form: {
            name: '',
            region: '',
            date1: '',
            date2: '',
            delivery: false,
            type: [],
            resource: '',
            desc: ''
            }
        }
    },
    created() {
        this.initialOrderData();
    },
    sockets: {
        connect: ()=> {
            // console.log(this.$options)
        },
        //监听预约成功事件
        yuyueSuccess: function(msg) {
            if(msg.code == 0){
                this.$options.methods.showNotify.bind(this)();
                this.initialOrderData.bind(this)();
            }
        },
        hasCancle:function(msg) {
            if(msg.code == 0){
                this.$options.methods.showNotify.bind(this)();
                this.initialOrderData.bind(this)();
            }
        },
    },
    mounted() {
        this.initialShopData();
        this.initialOrderData();
        //登录后加入socket room，保存自己店铺的socket_id
        this.$socket.emit('join', {id:this.shopId})
    },
    methods: {
        showNotify(){
            this.$notify({
                title: '提示',
                message: '您收到一个新的订单处理！'
            });
        },
        showSomeOrder(num){
            if(this.orderData){
                switch(num){
                case 0:
                    this.someOrderData = this.orderData;
                    break;
                case 1:
                    this.someOrderData = [];
                    this.orderData.map((item,index)=>{
                        if(item.status == 0){
                            this.someOrderData.push(item);
                        }
                    })
                    break;
                case 2:
                    this.someOrderData = [];
                    this.orderData.map((item,index)=>{
                        if(item.status == 2){
                            this.someOrderData.push(item);
                        }
                    })
                    break;
                }
            }
            
        },
        countOrderNum(){
            if(this.orderData){
                this.orderData.map((item,index)=>{
                    if(item.status == 0){
                        this.noReceiveOrderNum++;
                    }else if(item.status == 1){
                        this.ReceiveOrderNum++;
                    }else{
                        this.finalOrderNum++;
                    }
                })
            }
        },
        tableRowClassName({row, rowIndex}) {
            if (rowIndex === 1) {
                return 'warning-row';
            } else if (rowIndex === 3) {
                return 'success-row';
            }
            return '';
        },
        initialShopData(){
            if(this.is_mlogin){
                    Vue.axios.get('/api/shop/detail',{
                    params:{
                        shop_id:this.shopId
                    }
                }).then((res) => {
                    this.shopInfo = res.data;
                    // console.log(this.shopInfo)
                })
            }else{
                this.$toast('您还未登录，请先登录！');
                setTimeout(()=>{  
                    this.$router.push({ path: this.redirect || '/mlogin'})
                },2000)
            }
        },
        initialOrderData(){
            if(this.is_mlogin){
                Vue.axios.get('/api/morder',{
                params:{
                    shop_id:this.shopId
                }
                }).then((res) => {
                    this.orderData = res.data.orderData;
                    //初始化数据默认显示全部
                    this.showSomeOrder(0)
                })
            }else{
                this.$toast('您还未登录，请先登录！');
                setTimeout(()=>{  
                    this.$router.push({ path: this.redirect || '/mlogin'})
                },2000)
            }
        },
        //表格接单操作
        handleReceiveOrder(index, row, status) {
            let { shop_id, _id, type } = row,
                user_id = row.user_id._id;
            if(this.is_mlogin){
                Vue.axios.get('/api/morder/receive',{
                params:{
                    _id,
                    status: status //设置订单状态
                }
                }).then((res) => {
                    let data = res.data;
                    if(data.tips){
                        this.$toast(data.tips);
                    }
                    if(data.code == 0){
                        //操作成功则重新获取数据更新视图
                        this.initialOrderData();
                    }
                    this.$socket.emit('receive', {code:0,tips:'成功接单',user_id:user_id })
                })
            }else{
                this.$toast('您还未登录，请先登录！');
                setTimeout(()=>{  
                    this.$router.push({ path: this.redirect || '/mlogin'})
                },2000)
                return;
            }
            
        },
        //格式化订单状态
        setStatus(cellValue){
            switch(cellValue){
                case 0: return '未接单';break;
                case 1: return '已接单';break;
                case 2: return '已完成';break;
            }
        },
        //格式化排号
        formatterRowNumber(row,column,cellValue){
            if(cellValue == '0'){
                return '未排号';
            }else{
                return cellValue;
            }
        },
        dropdownhandl(command) {
            switch(command){
                case '0':
                this.$confirm('确定退出当前账号吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    Cookies.remove('shop_id');
                    Cookies.remove('is_mlogin');
                    this.$router.push({ path: this.redirect || '/mlogin'})
                }).catch(() => {
                            
                });
                break;
                case '1':
                    this.handleSelect(3);
                break;
            }
        },
        handleSelect(index) {
            this.dataType = index
        }

    }
}
</script>

<style lang="less" scoped>
    .header{
        box-sizing: border-box;
        background: #545C64;
        color: rgb(255, 208, 75);
        border: 0 none;
        font-size: 0;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 3;
        height: 55px;
        overflow: hidden;

        .header-left{
            line-height: 50px;
            text-align: left;
            float: left;
            .title{
                display: inline-block;
                font-size: 18px;
                font-weight: 500;
                width: 200px;
                text-align: center;
                color: #fff;
            }
        }

        .header-right{
            line-height: 50px;
            float: right;
            margin: 5px 10px 0 0;
        }
    }
    .nav{
        position: fixed;
        top: 55px;
        left: 0;
        width: 200px;
        height: 100%;
        background: #545C64;
        color: #fff;
        font-size: 14px;
        overflow-y: auto;
        z-index: 1000;

        .el-menu{
            border: 0;
        }
    }
    .content{
        height: 100%;
        margin: 50px 20px 0 220px;
        padding: 20px 0;
        box-sizing: border-box;

        .el-table .warning-row {
            background: oldlace;
        }

        .el-table .success-row {
            background: #f0f9eb;
        }
    }  

    .form-wrapper{
        width: 50%;
        margin: 0 auto;

        .rate{
            margin-top: 10px;
        }
        
    }
    .shop-image{
        width: 30%;
        margin: 20px auto;
        .demonstration{
            
        }
        img{
            width: 100%;
            height: auto;
        }
    }
      
</style>
