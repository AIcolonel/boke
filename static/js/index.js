(function($){
	$('#btn-register').on('click',function(){
		$('#register').css('display','block');
		$('#login').css('display','none');
	})

	$('#btn-login').on('click',function(){
		$('#login').css('display','block');
		$('#register').css('display','none');
	})


	// 验证注册表单
	
	var $register=$('#register').find('.btn-register');
	
	$register.on('click',function(){

		var $username=$('#register').find('.username');
		var $password=$('#register').find('.password');
		var $repassword=$('#register').find('.repassword');
		var $error=$('#register').find('.text-danger');

		var errMsg='';
		var reg1=/^[a-z][a-z|0-9|_]{1,13}/i;
		var reg2=/^\w{3,8}/;
		if(!reg1.test($username.val())){
			errMsg='用户名以字母开头，且包含数字或是下划线等，3-10个字符';
		}else if(!reg2.test($password.val())){
			errMsg='密码为3-8个字符';
		}else if($password.val()!=$repassword.val()){
			errMsg='密码不匹配';
		}

		if(errMsg){
			$error.html(errMsg);
			return;
		}else{
			$error.hide();
			$.ajax({
				url:'/user/register',
				data:{
					username:$username.val(),
					password:$password.val()
				},
				type:'POST',
				dataType:'json'
			})
			.done(function(data){
				if(data.code==0){
					$('#btn-login').trigger('click');
				}else{
					$error.show();
					$error.html(data.message);
				}
			})
			.fail(function(err){
				console.log(err);
			})
		}
			
	})


	// 登录验证
	$login=$('#login').find('.btn-login');

	$login.on('click',function(){
		var $username=$('#login').find('.username');
		var $password=$('#login').find('.password');
		var $error=$('#login').find('.text-danger');


		var errMsg='';
		var reg1=/^[a-z][a-z|0-9|_]{1,13}/i;
		var reg2=/^\w{3,8}/;
		if(!reg1.test($username.val())){
			errMsg='用户名以字母开头，且包含数字或是下划线等，3-10个字符';
		}else if(!reg2.test($password.val())){
			errMsg='密码为3-8个字符';
		}

		if(errMsg){
			$error.html(errMsg);
			return;
		}else{
			$error.hide();
			$.ajax({
				url:'/user/login',
				data:{
					username:$username.val(),
					password:$password.val()
				},
				type:'POST',
				dataType:'json'
			})
			.done(function(data){
				if(data.code==0){//登录成功
					/*
					
					// 隐藏登录框
					$('#login').hide();
					// 显示用户信息栏
					$('#exit').show();
					let html='欢迎'+data.user.username;
					$('#exit').find('.btn-block').html(html);

					*/

					window.location.reload();
				}else{
					$error.show();
					$error.html(data.message);
				}
			})
			.fail(function(err){
				console.log(err);
			})
		}
	})

	// 退出验证
	$('#btn-exit').on('click',function(){
		$.ajax({
			url:'/user/logout',
			type:'GET',
			dataType:'json'
		})
		.done(function(data){
			if(data.code==0){
				window.location.reload();
			}
		})
		.fail(function(err){
			console.log(err);
		})
	})

	// 处理点击页码请求
	/*
	$('#article-page').on('click','a',function(){
		// console.log(this);
		var page=1;
		var $this=$(this);
		var currentPage=$('#page').find('.active a').html();

		if($this.attr('aria-label')=="Previous"){
			// 显示上一页
			page=currentPage*1-1;
		}else if($this.attr('aria-label')=="Next"){
			// 显示下一页
			page=currentPage*1+1;
		}else{
			page=$this.html();
		}
		// console.log(page);

		var query='page='+page;
		var category=$('#category-id').val();

		if(category){
			query+= '&category='+category;
		}

		$.ajax({
			url:'/articles?'+query,
			type:'GET',
			dataType:'json'
		})
		.done(function(result){
			// console.log(result);
			if(result.code==0){//操作成功
				createArticleList(result.data.docs);
				buildPage(result.data.list,result.data.page);
			}
		})
		.fail(function(err){
			console.log(err);
		})
	})
	*/
	var $articlePage=$('#article-page');
	$articlePage.on('get-data',function(ev,result){
		if(result.code==0){//操作成功
			createArticleList(result.data.docs);
			buildPage($articlePage,result.data.list,result.data.page);
		}
	})
	$articlePage.pagination();


	function createArticleList(articles){
		console.log(articles);
		var html=''; 
		for(var i=0;i<articles.length;i++){
			var data = moment(articles[i].createAt).format('YYYY年MM月DD日 HH:mm:ss ');
			html+=
				`
				<div class="panel panel-default content-item">
				  	<!-- Default panel contents -->
				  	<div class="panel-heading">
				  		<h3><a class="link" href="/view/${articles[i]._id.toString()}">${ articles[i].title }</a></h3>
				  	</div>
				  	<div class="panel-body">
				   		${ articles[i].intro }
				  	</div>
					<div class="panel-footer">
			            <span class="glyphicon glyphicon-user"></span>
			            <span class="content-footer-text text-muted">
			            	${ articles[i].author.username }
			            </span>
			            <span class="glyphicon glyphicon-th-list"></span>
			            <span class="content-footer-text text-muted">
			            	${ articles[i].category.name }
			            </span>
			            <span class="glyphicon glyphicon-time"></span>
			            <span class="content-footer-text text-muted">
			            ${ data }</span>
			            <span class="glyphicon glyphicon-eye-open"></span>
			            <span class="content-footer-text text-muted"><em>${ articles[i].click }</em>已阅读</span>
			         </div>
				</div>
				`
		}
		$('#article-list').html(html);
			
	}

	function buildPage($page,list,page){
		var html='';
		html+=`
			<li>
		      <a href="javascript:;" aria-label="Previous">
		        <span aria-hidden="true">&laquo;</span>
		      </a>
		    </li>
		`;
		for(let i=1;i<=list.length;i++){
			if(i==page){
				html+=`<li class="active"><a href="javascript:;">${ i }</a></li>`
			}else{
				html+=`<li><a href="javascript:;">${ i }</a></li>`
			}
		}
		html+=`
			<li>
		      <a href="javascript:;" aria-label="Next">
		        <span aria-hidden="true">&raquo;</span>
		      </a>
		    </li>
		`

		$page.find('.pagination').html(html);
	}	


})(jQuery);