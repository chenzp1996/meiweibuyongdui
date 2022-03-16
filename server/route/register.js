const express = require("express");
const router = express.Router();
const Users = require("../models/User").Users;

/**
 * @data    //用于返回到前端页面的提示内容，包含code、tips
 *      code(0:注册成功 1: 信息输入错误)
 * 
 */
router.post("/", (req, res) => {
    let data = '';  
    let { phone, password, gender, area_info, avatar } = req.body;

    //信息输入有误则直接返回错误信息
    if(!phone ||!password || !gender || !area_info || !avatar){
        data={code:1,tips:'信息输入有误，请确认后再次尝试'}
        res.status(200),
        res.json(data)
    }
    

    //查找账户
    Users.find({
        phone: phone
    }, (err, result) => {
        //没找到该手机号则允许注册
        if (result.length === 0) {
            //判断两次密码是否输入一致
            if (password[0] === password[1]) {
                //后端再次判断密码一致则写入数据库
                Users.create({
                    phone,
                    password: password[0],
                    gender,
                    area_info,
                    avatar
                })
                data={code:0,tips:'注册成功！'}
                res.status(200),
                res.json(data)
                console.log('注册成功！')

            }else{
                // 密码输入不一致
                data={code:1,tips:'两次密码输入不一致！'}
                res.status(200),
                res.json(data)
            }
        } else {
            // 用户名存在
            data={code:1,tips:'手机号已被注册，请重新填写或直接登录！'}
            res.status(200),
            res.json(data)
        }
    })

})

module.exports = router;