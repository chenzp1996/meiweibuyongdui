const mongoose = require('mongoose');
//创建用户表
var usersSchema = new mongoose.Schema({
    phone: {//用户账号
        type:String,
        required:true
    },
    password: {//密码
        type: String,
        required: true
    },
    gender: {//0-male-男  1-female-女
        type: String,
        required: true
    },
    user_type: {//用户类型：0-customer-普通用户 1-merchant-商家
        type: String,
        default: 0,
        required: true
    },
    avatar: String,//头像照片
    area_info: String,//用户地址
    createAt: {//创建时间(时间戳)              
        type: String,
        default: (new Date()).getTime()
    }
});
//创建用户模型
exports.Users = mongoose.model("Users",usersSchema);