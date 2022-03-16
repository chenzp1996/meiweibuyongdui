const mongoose = require('mongoose');
//创建订单表
var  OrderSchema = new mongoose.Schema({
    user_id:{
        type: mongoose.Schema.Types.ObjectId,//关联用户id
        ref:"Users"
    },
    shop_id:{
        type: mongoose.Schema.Types.ObjectId,//关联店铺id
        ref:"Shops"
    },
    name:{
        type:String,
        default:''
    },
    phone:{
        type:String,
        default:''
    },
    eatTime: {//预约截至时间，吃饭时间
        type:String,
        default:''
    },
    peopleNum: {//就餐人数
        type:Number,
    },
    createTime: {//创建时间 
        type:String,
        default:(new Date()).toLocaleString()
    },
    status: {//订单状态 0未接单 1已接单 2已完成
        type:Number,
        default:0
    },
    rowNumber : {//排号
        type:String,
        default:'0'
    },
    type : {//订单类型 0排队订单 1预约订单
        type:Number,
        default:0
    },
});
//创建用户模型
exports.Orders = mongoose.model("Orders",OrderSchema);