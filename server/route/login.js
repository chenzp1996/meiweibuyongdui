const express = require("express");
const router = express.Router();
const Users = require("../models/User").Users;

//点击登录时查找数据库，检查身份
router.post("/",(req,res)=>{
    let data = '';  
    let { phone, password } = req.body;
    if(!phone ||!password){
        data={code:0,tips:'账号或密码输入有误，请检查！'}
        res.status(200),
        // res.end('testtest')
        res.json(data)
        return 
    }
    
    Users.findOne({phone:phone},(error,result)=>{  
        if(!result){
            data={code:1,tips:'该手机未注册，请检查！'}
            res.status(200),
            res.json(data)
            return 
        }else{
            if(result.password != password){
                data={code:1,tips:'用户名不存在或密码输入错误！'}
                res.status(200),
                res.json(data)
                return 
            }else{
                // req.session.user = result;
                data = {
                    code: 0,
                    tips: '登陆成功',
                    avatar: result.avatar,  //返回头像
                    return_link: `/home`,  //返回跳转链接
                    userId: result._id,
                    phone: result.phone
                }
                //登录成功将登录状态1保存在cookie里
                res.cookie("user_id",result.id,{maxAge: 900000, httpOnly: true});
                res.status(200),
                res.json(data)
            }
        }
    });
})

module.exports = router;