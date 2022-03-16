<template>
  <div class="container">
        <van-nav-bar
            title="注册"
            left-text="返回"
            left-arrow
            @click-left="$router.go(-1);"
        />
        <div class="user-banner">
            <!-- 上传头像 -->
            <van-row type="flex" justify="center">
                <van-uploader :after-read="onUpdateAvatar" accept="image/gif, image/jpeg" multiple>
                    <svg-avatar :show="is_upload_avatar" :tip="is_tip"/>
                <img v-if="is_upload_avatar" :src="user_info.avatar" alt="用户头像">
                </van-uploader>
            </van-row>
        </div>
        <!-- <img class="user-banner" src="../assets/img/banner.png"> -->
        
        
        <van-cell-group @click="changeSvg">
            
            <van-field
                v-model="user_info.phone"
                required
                clearable
                label="账号"
                placeholder="请输入您的账号"
            />
            <van-field
                v-model="user_info.password[0]"
                required
                type="password"
                clearable
                label="密码"
                placeholder="请输入密码"
            />      
            <van-field
                v-model="user_info.password[1]"
                required
                type="password"
                clearable
                label="确认密码"
                placeholder="请确认密码"
            /> 

            <van-field
                @focus="is_show_area_popup=true"
                v-model="areaInfo"
                required
                label="地址"
                placeholder="选择省/市/区"
            />
            <van-popup v-model="is_show_area_popup" position="bottom">
                <van-area :area-list="areaList" value="110101"  @confirm="confirmArea" @cancel="is_show_area_popup=false"/>
            </van-popup>

            <van-radio-group v-model="user_info.gender">
                <van-radio name="0">男</van-radio>
                <van-radio name="1">女</van-radio>
            </van-radio-group>
            <!-- <van-radio-group v-model="user_info.userType">
                <van-radio name="0">普通用户</van-radio>
                <van-radio name="1">合作商家</van-radio>
            </van-radio-group> -->
            
        </van-cell-group>
        <div class="btn-wraper">
            <div class="btn btn-login" @click="register">注册</div>
            <router-link to="register" class="btn-register">已有账号？直接登录</router-link>
        </div>
  </div>
</template>
 
<script>
import Vue from 'vue'
import SvgAvatar from '../components/SvgAvatar';
import areaList from '../assets/js/area'

export default {
    name: '',
    components: {
        'svg-avatar': SvgAvatar
    },
    data() {
        return {
            areaList: areaList,
            is_show_area_popup:false,
            is_upload_avatar: false,    //是否已经上传图片
            is_tip: false,    //是否提示需要上传头像

            areaInfo:'',
            user_info:{
                phone: '',
                password:[],
                gender: '0',   //0男 1女
                avatar:'',
                areaInfo:[],
                userType: '0'
            }
        }
    },
    props:{
        
    },
    methods: {
        // 头像上传成功后
        onUpdateAvatar(file){
            this.user_info.avatar = file.content;
            this.is_upload_avatar = true;
        },
        //点击表单更换SVG头像，提示上传头像
        changeSvg(){
            this.is_tip = true;
        },
        //注册用户
        register(){
            var formData = this.validateForm();
            
            Vue.axios.post('/api/register',formData).then((res) => {
                var res = res.data;
                if(res){
                    this.$toast(res.tips);
                    if(res.code === 0){
                        let count = 2;
                        //顶部提示
                        this.$notify({
                            message: `${count}s后自动跳转到登录界面`,
                            duration: 2000,
                            background: '#1989fa'
                        });

                        setTimeout(()=>{
                            //3s后跳转到登录界面
                            this.$router.push('login')
                        },2000)
                    }
                }
            })
        },
        
        //确定选择家乡地址后
        confirmArea(val){
            this.is_show_area_popup = false;
            this.user_info.areaInfo = val;
            this.areaInfo = val[0].name+'/'+val[1].name+'/'+val[2].name
        },

        // 验证输入的用户信息
        validateForm() {
            const formData = this.user_info;
            let validateData = '';
            if(!formData.phone){
                this.$toast('请输入您的手机号码！');
                return false;
            }
            // else{
            //     //手机号正则
            //     var mPattern = /^1[34578]\d{9}$/; 
            //     //输出 true
            //     if(!mPattern.test(formData.phone)){
            //         this.$toast('请输入正确的11位手机数！');
            //         return false;
            //     }
            // }

            if(!formData.password[0] || !formData.password[1]){
                this.$toast('请确认您已输入两次密码！');
                return false;
            }
            if(formData.password[0] !== formData.password[1]){
                this.$toast('两次输入密码必须一致！');
                return false;
            }
            if(!formData.avatar){
                this.$toast('请上传您的头像！');
                return false;
            }
            if(formData.areaInfo.length == 0){
                this.$toast('请选择您的地址！');
                return false;
            }
            validateData = {
                avatar: formData.avatar,//此处图片为base64编码，需要进行处理后转化后保存到数据库
                phone: formData.phone.trim(),
                password: formData.password,
                gender: formData.gender == 0 ? "male" : "female",
                user_type: formData.userType == 0 ? "customer" : "merchant",
                area_info: `${formData.areaInfo[0].name}/${formData.areaInfo[1].name}/${formData.areaInfo[2].name}` || this.areaInfo
            }
            
            return validateData;
        }

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
    &-uploader{
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        width: 80px;
        height: 80px;
        margin: auto;

        img{
            width:100%;
            height: 100%;
            border-radius: 50%;
        }

    }   

    &-cell-group{
        margin: 20px;
    }
    &-radio-group{
        padding: 10px 15px;
    }
    &-radio{
        display: inline-block;
        margin-right: 30px;
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

.btn-wraper{
    text-align: center;
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

</style>
