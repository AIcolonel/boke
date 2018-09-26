const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const Cookies=require('cookies');
const swig=require('swig');
const session = require('express-session');
const MongoStore = require("connect-mongo")(session); 
  
 
//1.启动数据库
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/Personalblog',{ useNewUrlParser: true });
var db = mongoose.connection;

db.once('open',()=>{
	console.log('BD connect......')
})
 
//2.配置模板开始
swig.setDefaults({
	cache:false
})
app.engine('html', swig.renderFile);
app.set('views', './views');
app.set('view engine', 'html');

//3.配置静态资源
app.use(express.static('static'));

// 设置中间件,之后的每一个中间件都会有cookie
/*
app.use((req,res,next)=>{
	req.cookies=new Cookies(req,res);
	req.userInfo = {};
	let userInfo = req.cookies.get('userInfo');

	if(userInfo){
		try{
			req.userInfo = JSON.parse(userInfo)
		}catch(err){
			console.log(err)
		}
	}
	next();
})
*/

app.use(session({
	//设置cookie名称
    name:'zhuangzhuangchen',
    //用它来对session cookie签名，防止篡改
    secret:'dsjfkdfd',
    //强制保存session即使它并没有变化
    resave: true,
    //强制将未初始化的session存储
    saveUninitialized: true, 
    //如果为true,则每次请求都更新cookie的过期时间
    rolling:false,
    //cookie过期时间 1天
    cookie:{maxAge:1000*60*60*24},    
    //设置session存储在数据库中
    store:new MongoStore({ mongooseConnection: mongoose.connection })   
}))
 
app.use((req,res,next)=>{
	req.userInfo=req.session.userInfo || {};

	next();
})

//4.处理post请求中间件
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
 
//5.处理路由
 
// 显示首页
app.use('/',require('./router/index.js'));
 
// 处理用户注册,登录请求
app.use('/user',require('./router/user.js'));

// 进入管理或用户中心或退出管理系统
app.use('/admin',require('./router/admin.js'));

// 处理分类管理路由
app.use('/category',require('./router/category.js'));

//处理文章管理路由
app.use('/article',require('./router/article.js'));

// 处理评论路由
app.use('/comment',require('./router/comment.js'));

//处理新增资源路由
app.use('/resource',require('./router/resource.js'));

//处理用户信息中心首页路由
app.use('/home',require('./router/home.js'));


app.listen(3000,()=>{
	console.log('app is running in the 127.0.0.1:3000');
})