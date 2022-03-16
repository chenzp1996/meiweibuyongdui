const express = require("express");
const router = express.Router();
const Orders = require("../models/Order").Orders;

/**
 * @data    //用于返回到前端页面的提示内容，包含code、tips
 *            code(0:注册成功 1: 信息输入错误)
 * 
 */
let returnOrderRouter = function(io) {
    router.post("/", (req, res) => {
        let data = '';  
        let { name, phone, eatTime, peopleNum, user_id, shop_id, type } = req.body;

        if( !user_id ){
            data={code:1,tips:'请先登录账号！'}
            res.status(200),
            res.json(data)
            return;
        }
        //信息输入有误则直接返回错误信息
        if(type == 1){
            if( !name || !phone || !eatTime || !peopleNum ){
                data={code:1,tips:'预约信息输入有误，请确认后再次尝试'}
                res.status(200),
                res.json(data)
                return;
            }
        }else{
            if( !name || !phone || !peopleNum ){
                data={code:1,tips:'排队信息输入有误，请确认后再次尝试'}
                res.status(200),
                res.json(data)
                return;
            }
        }
        
        Orders.find({user_id:user_id,shop_id:shop_id},(err,result)=>{
            if(err){
                console.log(err);
            }
            //同一个用户在同一个店不能下两单，
            if(result.length != 0){
                result.map((item,index)=>{
                    if(item.type == type){
                        data={code:1,tips:'您已经有该店的预约订单！'}
                        res.status(200),
                        res.json(data)
                        return;
                    }
                })
            }

            Orders.create({
                name,
                phone,
                eatTime,
                peopleNum,
                user_id,
                shop_id,
                type
            })
            data={code:0,tips:'预约成功！'}
            res.status(200),
            res.json(data)
        }) 
    })

    router.get("/", (req, res) => {
        let data = '';
        let user_id = req.query.user_id;
        // console.log(user_id)
        if(!user_id){
            data={code:1,tips:'请先登录账号！'}
            res.status(200),
            res.json(data)
            return;
            // localtion.replace('/login');
        }
        Orders.find({user_id}).populate('shop_id').
        exec(function (err, result){
            if(err){
                console.log(err);
            }
            //同一个用户在同一个店不能下两单，
            if(result.length == 0){
                data={code:2,tips:'您还没有预约过餐厅，快去预约吧！'}
                res.status(200),
                res.json(data)
            }else{
                data={code:0,result}
                res.status(200),
                res.json(data)
            }
        })
    })

    router.get("/delete", (req, res) => {
        let data = '';
        let {user_id,shop_id} = req.query;
        if(!user_id){
            data={code:1,tips:'您没有权限删除哦！'}
            location.replace('/login');
        }
        Orders.findOneAndRemove({user_id,shop_id},(err, result)=>{
            if(err){
                console.log(err);
            }
            //订单存在即删除
            if(result){
                // console.log(result)
                data={code:0,tips:'删除成功！'}
                res.status(200),
                res.json(data)
            }
        })
    })
    return router;
}

module.exports = returnOrderRouter;