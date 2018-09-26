const mongoose = require('mongoose');

// 生成一个Schema模型
const BlogSchema = new mongoose.Schema({
  	username:{
  		type:String
  	},
  	password:{
  		type:String
  	},
  	isAdmin:{
  		type:Boolean,
  		default:false
  	}
});

// 利用Schema生成model
const Blog = mongoose.model('Blog', BlogSchema);

module.exports=Blog;