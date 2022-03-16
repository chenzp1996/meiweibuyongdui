const express = require("express");
const router = express.Router();
const Shops = require("../../models/Shop").Shops;

//点击登录时查找数据库，检查身份
router.post("/",(req,res)=>{
    let data = '';  
    // console.log(req.body)
    let { phone, password } = req.body;
    if(!phone ||!password){
        data={code:0,tips:'账号或密码输入有误，请检查！'}
        res.status(200),
        // res.end('testtest')
        res.json(data)
        return 
    }
    
    Shops.findOne({phone:phone},(error,result)=>{  
        if(!result){
            data={code:1,tips:'该店铺未注册，请检查！'}
            res.status(200),
            res.json(data)
            return 
        }else{
            if(result.password != password){
                data={code:1,tips:'店铺不存在或密码输入错误！'}
                res.status(200),
                res.json(data)
                return 
            }else{
                // req.session.user = result;
                data = {
                    code: 0,
                    tips: '登录成功',
                    shopId: result.id,
                }
                //登录成功将登录状态1保存在cookie里
                res.cookie("shop_id",result.id,{maxAge: 900000, httpOnly: true});
                res.status(200),
                res.json(data)
            }
        }
    });
})

module.exports = router;