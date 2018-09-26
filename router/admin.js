const express = require('express');
const router = express.Router();
const Blog=require('../models/model.js');
const Comment=require('../models/comment.js');
const paging=require('../util/paging.js');
const fs=require('fs');
const path=require('path');
const hmac=require('../util/hmac.js');

//引用上传文件包
const multer = require('multer');
const upload = multer({ dest: 'static/uploads/' });

router.use((req,res,next)=>{
	if(req.userInfo.isAdmin){
		next();
	}else{
		res.send('<h1>请使用管理员账号登录</h1>');
	}

})

router.get('/',(req,res)=>{
	res.render('admin/admin.html',{
		userInfo:req.userInfo
	});
})

router.get('/users',(req,res)=>{
	/*
	// 分页原理，利用传递page参数，用req.query拿到page，
	//设定每页显示的数据条数limit这样就可利用这两条数据进行分页

	let page =req.query.page || 1;

	if(page<=0){
		page = 1;
	}
	let limit=3;
	
	// 获取数据的总条数，进而计算出总页数
	Blog.estimatedDocumentCount({})
	.then((count)=>{
		let pages=Math.ceil(count/limit);
		if(page>pages){
			page=pages;
		}

		// 由于html模板无法遍历循环，因此我们可以自己定义一个数组，将页码存进去，然后进行循环
		let list=[];
		for(let i=1;i<=pages;i++){
			list.push(i);
		}

		// 要显示下一页的数据，则需要将上一页的数据条数跳过
		let skip=(page - 1) * limit;
		
		// 获取用户信息
		Blog.find({},'_id username isAdmin')
		.skip(skip)
		.limit(limit)
		.then((users)=>{
			res.render('admin/admin-list.html',{
				userInfo:req.userInfo,
				users:users,
				page:page*1,
				list:list,
				pages:pages
			});
		})
	})
	*/
	let options={
			page:req.query.page,//页码
			model:Blog,//数据库模板
			query:{},//条件
			field:'_id username isAdmin',//字段
			sort:{_id:1},//排序
		}
	paging(options)
	.then((data)=>{
		res.render('admin/admin-list.html',{
			userInfo:req.userInfo,
			users:data.docs,
			page:data.page,
			list:data.list,
			pages:data.pages
		});
	})
})

//处理上传文件路由
router.post('/uploadImages',upload.single('upload'),(req,res)=>{
	let path = "/uploads/"+req.file.filename;
	res.json({
		uploaded:true,
        url:path
	})
})


// 处理评论管理页面路由
router.get('/comments',(req,res)=>{
	Comment.findPagingComments(req)
	.then((comment)=>{
		res.render('admin/comment-list.html',{
			userInfo:req.userInfo,
			comment:comment.docs,
			list:comment.list,
			page:comment.page,
			pages:comment.pages
		})
	})
})

// 处理评论删除路由
router.get('/comment/delete/:id',(req,res)=>{
	Comment.remove({_id:req.params.id},(err,docs)=>{
		if(err){//删除数据失败
			res.render('admin/err.html',{
				userInfo:req.userInfo,
				message:'操作失败，未能删除评论',
			})
		}else{//删除数据成功
			res.render('admin/success.html',{
				userInfo:req.userInfo,
				message:'成功删除评论',
				url:'/admin/comments'
			})
		}
	})
})

// 处理站点管理页面路由
router.get('/site',(req,res)=>{
	let filePath = path.normalize(__dirname + '/../site-info.json');
	fs.readFile(filePath,(err,data)=>{
		if(err){
			console.log(err)
		}else{
			let siteDate=JSON.parse(data);
			res.render('admin/site.html',{
				userInfo:req.userInfo,
				siteDate:siteDate
			})
		}
	})
})

// 处理站点site提交表单路由
router.post('/site',(req,res)=>{
	let filePath = path.normalize(__dirname + '/../site-info.json');
	console.log(req.body);
	let body=req.body;

	let siteDate={
		name:body.name,
		author:{
			name:body.authorName,
			intro:body.authorIntro,
			image:body.authorImage,
			wechat:body.authorWechat
		},
		icp:body.icp
	}
	//将获取的轮播图循环添加进一个数组中
	siteDate.carouseles=[];
	if(body.carouselUrl.length && (typeof(body.carouselUrl)) == 'object'){
		for(let i = 0;i<body.carouselUrl.length;i++){
			siteDate.carouseles.push({
				url:body.carouselUrl[i],
				path:body.carouselPath[i]
			})			
		}
	}else{
		siteDate.carouseles.push({
			url:body.carouselUrl,
			path:body.carouselPath
		})
	}

	//将获取的广告循环添加进一个数组中
	siteDate.ads=[];
	if(body.adUrl.length && (typeof(body.adUrl)) == 'object'){
		for(let i = 0;i<body.adUrl.length;i++){
			siteDate.ads.push({
				url:body.adUrl[i],
				path:body.adPath[i]
			})			
		}
	}else{
		siteDate.ads.push({
			url:body.adUrl,
			path:body.adPath
		})
	}

	let strSiteDate=JSON.stringify(siteDate);
	// console.log(typeof(strSiteDate));
	fs.writeFile(filePath,strSiteDate,(err)=>{
		if(err){
			res.render('admin/err.html',{
				userInfo:req.userInfo,
				message:'操作失败，未能更新站点信息',
			})
		}else{
			res.render('admin/success.html',{
				userInfo:req.userInfo,
				message:'更新站点信息成功',
				url:'/admin/site'
			})
		}
	})
})

// 处理修改密码首页路由
router.get('/changepassword',(req,res)=>{
	res.render('admin/password.html',{
		userInfo:req.userInfo,
	})
})

// 处理提交修改密码表单POST请求
router.post('/password',(req,res)=>{
	let body=req.body;
	console.log(body);
	Blog.update({_id:req.userInfo.id},{password:hmac(body.password)})
	.then((result)=>{
		// 用户修改密码成功后需要重新登录，因此要返回登录界面，且是退出登录状态
		req.session.destroy();
		res.render('admin/success.html',{
			userInfo:req.userInfo,
			message:'更新密码成功',
			url:'/'
		})
	})
})

module.exports=router;