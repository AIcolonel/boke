const express = require('express');
const router = express.Router();
const Blog=require('../models/model.js');
const hmac=require('../util/hmac.js');

// 用户注册
router.post('/register',(req,res)=>{
	console.log(req.body);
	Blog
	.findOne({username:req.body.username})
	.then((data)=>{
		let result={
			code:0,//成功
			message:'注册成功'
		}

		if(data){
			result.code=1;//返回失败
			result.message='注册失败,用户已存在';
			res.json(result);
		}else{
			
			Blog.insertMany({
				username:req.body.username,
				password:hmac(req.body.password)
			},(err,data)=>{
				if(err){
					console.log(err);
				}else{
					res.json(result)
				}
			})
		}
	})
})
 
// 用户登录
router.post('/login',(req,res)=>{
	console.log(req.body);
	Blog
	.findOne({username:req.body.username,password:hmac(req.body.password)})
	.then((data)=>{
		let result={
			code:0,//成功
			message:'登录成功'
		}

		if(data){
			/*
			result.user={
				id:data._id,
				username:data.username,
				isAdmi:data.isAdmi
			}
			req.cookies.set('userInfo',JSON.stringify(result.user));
			res.json(result);
			*/
			req.session.userInfo={
				id:data._id,
				username:data.username,
				isAdmin:data.isAdmin
			}

			res.json(result);
		}else{
			result.code=1;
			result.message='未找到该用户'
			res.json(result);
		}
	})
})


// 用户退出

router.get('/logout',(req,res)=>{
	result={
		code:0,//成功
		message:'退出成功'
	};
	// 将cookies设置成空
	// req.cookies.set('userInfo',null);

	//将session破坏掉 
	req.session.destroy();
	res.json(result);
})

module.exports=router;