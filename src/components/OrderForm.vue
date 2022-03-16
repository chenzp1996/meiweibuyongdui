<template>
  <div class="container">  
        <p class="title">
            <van-icon name="send-gift" color='#FF4444'/>
            <span>预约订座</span>
        </p>
      <van-cell-group> 
            <van-notice-bar
                text="请至少提前一天预约订座！                           "
                left-icon="volume-o"
            /> 
            <van-field
                v-model="order_info.name"
                required
                clearable
                label="联系人："
                placeholder="请输入您的姓名"
            />
            <van-field
                v-model="order_info.phone"
                required
                clearable
                label="联系方式："
                placeholder="请输入您的联系方式"
            />    
            <!-- 到店人数 -->
            <div class="van-cell people-num">到店人数：
                <van-stepper integer :min="1" :max="20" v-model="order_info.peopleNum" />
            </div>
            <!-- 预约时间 -->
            
            <van-field
                @focus="datetimePickerShow=true"
                label="到店时间："
                v-model="order_info.eatTime"
            />
            <van-popup v-model="datetimePickerShow" position="bottom" :overlay="true">
            <van-datetime-picker
                title="年/月/日/时/分"
                @confirm="confirmEatTimer"
                @cancel="datetimePickerShow=false"
                type="datetime"
                :min-date="minDate"
                :max-date="maxDate"
                :min-hour="minHour"
                :max-hour="maxHour"
            />
            </van-popup>           
        </van-cell-group>

        <div class="btn-wraper">
            <div class="btn btn-login" @click="getOrder">提交订单</div>
            <router-link to="/order" class="btn-register">查看历史订单</router-link>
        </div>
  </div>
</template>
 
<script>
import Vue from 'vue'
import Cookies from 'js-cookie'
import SvgAvatar from '../components/SvgAvatar';
import areaList from '../assets/js/area'

export default {
    name: '',
    components: {
        
    },
    data() {
        return { 
            is_login: Cookies.get('is_login') || this.$store.state.is_login ||'',
            user_id: localStorage.getItem('user_id') || '',

            datetimePickerShow: false,  //是否显示时间选择器
            
            minHour: 10,    //开始营业时间
            maxHour: 22,    //关门时间
            minDate: null,  //可以预约最近的一天
            maxDate: null,  //最多可以预约到的一天
            
            order_info:{
                name:'',
                phone: '',
                peopleNum: 6,
                eatTime:null,
            }
        }
    },
    props:{
        
    },
    computed: {
        year: ()=>{
            return Number(new Date().getUTCFullYear());
        },
        month: ()=>{
            return Number(new Date().getUTCMonth());  
        },
        day: ()=>{
            return Number(new Date().getUTCDate())
        },
        hour: ()=>{
            return Number(new Date().getHours())
        },
        minutes: ()=>{
            return Number(new Date().getMinutes())
        },
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
        this.getMinDate();
        this.getMaxDate();
    },
    methods: {
        getMinDate(){
            this.minDate = new Date(this.year,this.month,this.day+1,10,this.minutes)
        },
        getMaxDate(){
            this.maxDate = new Date(this.year,this.month+1,this.day+2,20,0)
        },
        
        //确定选择时间后
        confirmEatTimer(val){
            this.datetimePickerShow = false;
            this.order_info.eatTime = val.toLocaleString( );
        },
        //子组件修改父组件值时，可以使用emit调用父组件事件
        setOrderFormShow(){
            this.$emit('setOrderFormShow', false);
        },
        fetchShopOrderNum(){
            this.$emit('fetchShopOrderNum');
        },

        // 验证输入的订单信息
        validateForm() {
            const formData = this.order_info;
            let validateData = '';

            if(!formData.name){
                this.$toast('请输入您的姓名！');
                return false;
            }
            if(!formData.phone){
                this.$toast('请输入您的手机号码！');
                return false;
            }
            if(!formData.eatTime){
                this.$toast('请输入您到店时间！');
                return false;
            }
            validateData = {
                name: formData.name.trim(),
                phone: formData.phone.trim(),
                eatTime: formData.eatTime,
                peopleNum: formData.peopleNum,
                user_id:this.user_id,
                shop_id:this.$route.query.shop_id,
                type: 1
            }
            return validateData;
        },
        //提交订单
        getOrder(){
            let formData = this.validateForm();
            if(!this.is_login){
                this.$toast('请先登录您的账号！');
                return false;
            }
            Vue.axios.post('/api/order',formData).then((res) => {
                var res = res.data;
                if(res){
                    this.$toast(res.tips);
                    this.setOrderFormShow();//隐藏form表单
                    if(res.code == 0){
                        this.fetchShopOrderNum();
                    }
                    //当前用户加入到socket room
                    this.$socket.emit('join', {id:this.user_id})
                    //向指定店铺发送订单
                    this.$socket.emit('yuyue', {code:0,tips:'预约成功',shop_id:this.$route.query.shop_id})
                }
            })
        },

    },
};
</script>
 
<style lang="less" scoped>

.user-banner {
    height: 200px;
    background: url("../assets/img/banner.png") no-repeat;
    background-size: 100%;
    position: relative;
}

.van{   
    &-stepper{
        display: inline-block;
    }

    &-loading{
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        margin: auto;
        color: #fff;
        padding: 10px;
        background: #c9c9c9;
    }   
}

.people-num{
    justify-content: space-between;
}

.btn-wraper{
    text-align: center;
    padding-bottom: 10px;
    .btn-login{
        width: 60%;
        height: 40px;
        background: RGB(25,137,250);
        border-radius: 10px;
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 10px auto 0;
    }
    .btn-register{  
        font-size: 14px;
        color: RGB(25,137,250);
    }
}
.title{
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

</style>
