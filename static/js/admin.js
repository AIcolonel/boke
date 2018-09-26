(function($){
	// 退出验证
	$('#admin-exit').on('click',function(){
		$.ajax({
			url:'/user/logout',
			type:'GET',
			dataType:'json'
		})
		.done(function(data){
			if(data.code==0){
				window.location.href='/';
			}
		})
		.fail(function(err){
			console.log(err);
		})
	})
})(jQuery)