<template>
  <div class="container">
        <div class="user-banner">
            <!-- 上传头像 -->
            <van-row type="flex" justify="center">
                <div class="svg">
                    <svg-avatar />
                </div>
            </van-row>
        </div>
        <van-cell-group class="form-wraper">
            <van-field
                v-model="user_info.phone"
                required
                clearable
                label="账号"
                placeholder="请输入手机号码"
            />
            <van-field
                v-model="user_info.password"
                required
                type="password"
                clearable
                label="密码"
                placeholder="请输入密码"
            />
            
        </van-cell-group>
        <div class="btn-wraper">
            <div class="btn btn-login" @click="login">登录</div>
            <router-link to="register" class="btn-register">没有账号？马上去注册</router-link>
        </div>
    
  </div>
</template>
 
<script>
import Vue from 'vue';
import Cookies from 'js-cookie'
import SvgAvatar from '../components/SvgAvatar';

export default {
    name: '',
    data() {
        return {
            user_info:{
                phone:'',
                password:''
            }  
        }
    },
    components: {
        'svg-avatar': SvgAvatar
    },
    props:{
        
    },
    methods: {
        //登录
        login(){
            var formData = this.validateForm();
            Vue.axios.post('/api/login',formData).then((res) => {
                var res = res.data;
                if(res){
                    this.$toast(res.tips);
                    if(res.code === 0){
                        let count = 2;
                        //顶部提示
                        this.$notify({
                            message: `${count}s后自动跳转到首页`,
                            duration: 2000,
                            background: '#1989fa'
                        });    
                        localStorage.setItem("avatar",res.avatar);
                        localStorage.setItem("user_id",res.userId);
                        Cookies.set('user_id',res.userId);
                        Cookies.set('is_login',true);
                        
                        this.$store.dispatch('setUser',res);


                        setTimeout(()=>{
                            //3s后跳转到登录界面
                            this.$router.push(res.return_link)
                        },2000)
                    }
                }
            })
        },

        // 验证输入的用户信息
        validateForm() {
            const formData = this.user_info;
            let validateData = '';
            if( !formData.phone ){
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
            if( !formData.password ){
                this.$toast('请确认密码！');
                return false;
            }
            validateData = {
                phone: formData.phone.trim(),
                password: formData.password.trim(),
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

    .svg{
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        width: 80px;
        height: 80px;
        margin: auto;
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
        margin: 50px auto 0;
    }
    .btn-register{
        font-size: 14px;
        color: RGB(25,137,250);
    }
}



</style>
