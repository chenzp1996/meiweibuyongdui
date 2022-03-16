const express = require("express");
const router = express.Router();
const url = require('url');
const Shops = require("../models/Shop").Shops;
const shopData = require('../../../mwbyd/src/assets/json/shopData.json')

router.get("/",(req,res)=>{
    let data = '',
        shopList = [];

        Shops.find({},(err,result)=>{
        result.forEach(v=>{
            let obj = {name,address,frontImg,avgScore,avgPrice} = v;
            shopList.push(obj);           
        })
        data={code:0,shopList};
        res.status(200),
        res.json(data)
        return 
    });
   
    // 批量导入数据到数据库
    // shopData.forEach(v=>{
    //     Shops.create({
    //         name: v.name,
    //         address: v.address,
    //         frontImg: v.frontImg,
    //         avgScore: v.avgScore,
    //         avgPrice: v.avgPrice,
    //         phone: v.phone
    //     }) 
    // })
    // console.log('upload success')
})

router.get('/detail',(req,res)=>{
    let data = '',
        id = req.query.shop_id;
    Shops.findById(id,(err,result)=>{
        data = {
            code: 0,
            name: result.name,
            isOpen: result.isOpen,  //返回头像
            address: result.address,  //返回跳转链接
            shopId: result._id,
            phone: result.phone,
            frontImg: result.frontImg,
            avgScore: result.avgScore,
            openTime: result.openTime,

        }
        res.status(200),
        res.json(data)
        return 
    });
})

// router.post("/",(req,res)=>{
//     let data = ''; 
//     let {name, address, avgScore, frontImg, avgPrice} = req.body;
//     Shops.create({
//         name,
//         address,
//         frontImg,
//         avgScore,
//         avgPrice,
//     }) 
//     console.log('create shop success')
  
// })

module.exports = router;