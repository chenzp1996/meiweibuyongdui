const express = require("express");
const router = express.Router();
const Orders = require("../../models/Order").Orders;

let returnMorderRouter = function(io) {
    router.get("/", (req, res) => {
        let data = '';
        let shop_id = req.query.shop_id;
        // console.log(user_id)
        if(!shop_id){
            data={code:1,tips:'请先登录账号！'}
            res.status(200),
            res.json(data)
            return;
            // localtion.replace('/login');
        }
        Orders.find({shop_id}).populate('user_id').
        exec(function (err, result){
            let orderData = result;
            if(err){
                console.log(err);
            }
            //同一个用户在同一个店不能下两单，
            if(orderData.length == 0){
                data={code:2,tips:'您没有需要处理的订单，快去做广告吧！'}
                res.status(200),
                res.json(data)
            }else{
                data={code:0,orderData}
                res.status(200),
                res.json(data)
            }
        })
    })

    router.get("/receive", (req, res) => {
        let data = '';
        let {_id, status} = req.query,
            rowNumber = _id.substring(_id.length-6);
        Orders.findByIdAndUpdate(_id,{status,rowNumber},(err, result)=>{
            if(err){
                console.log(err);
                return;
            }
            // io.socket.on('receive', (msg)=>{
            //     io.socket.broadcast.emit('hasReceive', msg );  
            // });

            data={code:0,tips:'操作成功！'}
            res.status(200),
            res.json(data)
        })
    })

    return router;

}

module.exports = returnMorderRouter;