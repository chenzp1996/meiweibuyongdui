const mongoose = require('mongoose');
//创建商家表
var shopSchema = new mongoose.Schema({
    name: {//店铺名
        type:String,
        required:true
    },
    phone:{ 
        type: String,
        required:true
    },
    password:{ 
        type: String,
        default: "123456"
    },
    address: {//地址
        type: String,
        required: true
    },
    frontImg: {//商家图片
        type: String,
        required: true
    },
    avgScore: {//评分
        type: Number,
        required: true
    },
    avgPrice: Number,//人均消费
    grade: {    //店铺等级：默认普通0  首页banner1  首页中部2   首页下方大图3   
        type: Number,
        default: 0
    },
    longitudeAndLatitude:{//预设经纬度，预备后期功能扩充
        type: String,
        default: "(114,23)"//默认值惠州市惠城区
    },
    isOpen:{    //是否营业状态，默认营业true
        type: Boolean,
        default: true
    },
    openTime:{  //营业时间段
        // parseInt('10:00:00'.split(":")[1])
        type: String,
        default: "10:00:00--22:00:00"
    }
      
});
//创建用户模型
exports.Shops = mongoose.model("Shops",shopSchema);