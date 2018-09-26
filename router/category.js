const express = require('express');
const router = express.Router();
const Category=require('../models/category.js');
const paging=require('../util/paging.js');

router.use((req,res,next)=>{
	if(req.userInfo.isAdmin){
		next();
	}else{
		res.send('<h1>请使用管理员账号登录</h1>');
	}

})

// 获取分类管理页面
router.get('/',(req,res)=>{
	/*
	//找到分类信息并插入页面
	Category.find({},'_id name order')
	.then((categories)=>{
		res.render('admin/category-list.html',{
			userInfo:req.userInfo,
			categories:categories
		});
	})
	*/

	let options={
			page:req.query.page,//页码
			model:Category,//数据库模板
			query:{},//条件
			field:'_id name order',//字段
			sort:{order:1},//排序
		}
	paging(options)
	.then((data)=>{
		res.render('admin/category-list.html',{
			userInfo:req.userInfo,
			categories:data.docs,
			page:data.page,
			list:data.list,
			pages:data.pages
		});
	})
})

// 获取新增分类页面
router.get('/add',(req,res)=>{
	res.render('admin/category-add.html',{
		userInfo:req.userInfo
	});
}) 

// 处理post表单提交
router.post('/add',(req,res)=>{
	// console.log(req.body);
	//在插入数据前首先判断数据库中是否有该数据
	Category.findOne({name:req.body.name})
	.then((result)=>{
		if(result){//已经存在该数据
			// res.send('该信息已经存在');
			res.render('admin/err.html',{
				userInfo:req.userInfo,
				message:'操作失败，该分类已经存在'
			})
		}else{//没有该数据，可以进行插入
			Category.insertMany({
				name:req.body.name,
				order:req.body.order
			})
			.then((newCate)=>{
				if(newCate){
					// res.send('插入数据成功');
					res.render('admin/success.html',{
						userInfo:req.userInfo,
						message:'成功插入数据',
						url:'/category'
					})
				}
			})
			.catch((err)=>{
				res.render('admin/err.html',{
					userInfo:req.userInfo,
					message:'操作失败，数据异常'
				})
			})
		}
	})
})


//处理编辑路由
router.get('/edit/:id',(req,res)=>{
	Category.findOne({_id:req.params.id})
	.then((category)=>{
		res.render('admin/category-edit.html',{
			userInfo:req.userInfo,
			category:category
		});
	})
	
})

// 提交分类编辑POST路由
router.post('/edit',(req,res)=>{
	// console.log(req.body)
	Category.findOne({name:req.body.name})
	.then((result)=>{
		// console.log(req.body);
		if(result && result.order){//数据库中已经存在该分类名称
			res.render('admin/err.html',{
				userInfo:req.userInfo,
				message:'操作失败，该名称已经被应用'
			})
		}else{//数据库中没有该分类名称，可以修改
			Category.updateOne({_id:req.body.id},{name:req.body.name,order:req.body.order},(err,docs)=>{
				if(err){//更新数据失败
					console.log(err)
				}else{//更新数据成功
					res.render('admin/success.html',{
						userInfo:req.userInfo,
						message:'成功更新数据',
						url:'/category'
					})
				}
			})
		}
	})
})

//处理删除路由
router.get('/delete/:id',(req,res)=>{
	// console.log(req.params.id);
	Category.remove({_id:req.params.id},(err,docs)=>{
		if(err){//删除数据失败
			res.render('admin/err.html',{
				userInfo:req.userInfo,
				message:'操作失败，数据库异常'
			})
		}else{//删除数据成功
			res.render('admin/success.html',{
				userInfo:req.userInfo,
				message:'成功删除数据',
				url:'/category'
			})
		}
	})
})
module.exports=router;