const express = require("express");
const router = express.Router();
const usersModel = require("../models/User").users;

//点击登录时查找数据库，检查身份
router.get("/",(req,res)=>{
    let data = '';  
    let { userId } = req.body;
    if(userId){
        data={code:1,tips:'该用户不存在，请检查或注册！'}
        res.status(200),
        res.json(data)
        return 
    }
    usersModel.findById(userId,(error,result)=>{
        console.log(result)
        // if(result.length === 0){
        //     data={code:1,tips:'该手机未注册，请检查！'}
        //     res.status(200),
        //     res.json(data)
        //     return 
        // }else{
        //     if(result.password != password){
        //         data={code:1,tips:'用户名不存在或密码输入错误！'}
        //         res.status(200),
        //         res.json(data)
        //         return 
        //     }else{
        //         // req.session.user = result;
        //         data = {
        //             code: 0,
        //             tips: '登陆成功',
        //             avatar: result.avatar,  //返回头像
        //             return_link: `/index?user=${result._id}`  //返回跳转链接
        //         }
        //         res.status(200),
        //         res.json(data)
        //     }
        // }
    });
    
})

module.exports = router;