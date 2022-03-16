const express=require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser'); 
var db = require("./lib/mongoose").db;  //链接数据库
const app = express();
const server = require('http').createServer(app);
var io=require("socket.io")(server);

//引进路由
const login = require("./route/login");
const register = require("./route/register");
const userinfo = require("./route/userinfo");
const shop = require("./route/shop");
const order = require("./route/order")(io);;

const mlogin = require("./route/merchant/mlogin");
const morder = require("./route/merchant/morder")(io);

app.use(cookieParser())
app.use(bodyParser.json()); // json文件
app.use(bodyParser.urlencoded({ extended: true })); // 处理普通表单
//使用路由
app.use("/login", login);
app.use("/register", register);
app.use("/userinfo", userinfo);
app.use("/shop", shop);
app.use("/order", order);

//商家登录
app.use("/mlogin", mlogin);
app.use("/morder", morder);

//配置服务端口
const port = process.env.PORT || 3000;

server.listen(3000, function () {
    console.log('启动成功，端口号为：' + port);
})

var arrAllSocket = [];

io.sockets.on('connection', (socket) => {
    socket.on('join', function (data) 
	{
		user = data.id;
		arrAllSocket[user] = socket.id;//把socket存到全局数组里面去
        console.log('店铺一:'+arrAllSocket[user])
    });

    //监听客户端yuyue事件
    socket.on('yuyue', (msg)=>{
        //客户端传过来指定要发送的商家
        let toShop = msg.shop_id;
        //所指定商家的socket_id
        let toSocket = arrAllSocket[toShop]
        if(toSocket){//存在则发送
            io.sockets.connected[toSocket].emit('yuyueSuccess',msg);
            console.log('成功向商家'+toSocket+'发送信息！')
        }else{
            console.log("没有成功向商家发送订单")
        }
    });
    
    //商家接单操作
    socket.on('receive', (msg)=>{
        // console.log(msg)
        let toUser = msg.user_id;
        //所指定商家的socket_id
        let toSocket = arrAllSocket[toUser]
        if(toSocket){//存在则发送
            io.sockets.connected[toSocket].emit('hasReceive',msg);
            console.log('成功向用户'+toSocket+'发送信息！')
        }else{
            console.log("没有成功接受订单")
        }
        
    });

    //用户取消订单操作
    socket.on('cancle', (msg)=>{
        let toShop = msg.shop_id;
        //所指定商家的socket_id
        let toSocket = arrAllSocket[toShop]
        if(toSocket){//存在则发送
            io.sockets.connected[toSocket].emit('hasCancle',msg);
            console.log('成功向用户'+toSocket+'发送信息！')
        }else{
            console.log("没有成功取消订单")
        }
        
    });

    socket.on("disconnect", ()=> {
        console.log("socket已停止使用");
    });

});