(function($){
	$('#btn-sub').on('click',function(){
		var reg=/^\w{3,8}/;
		var $password=$('#password');
		var $repassword=$('#repassword');
		var $error=$('.errmsg');

		var errMsg='';

		if(!reg.test($password.val())){
			$error.eq(0).html('密码为3-8个字符')
			return false;
		}else{
			$error.eq(0).html('')
		}

		if($password.val()!=$repassword.val()){
			$error.eq(1).html('密码不匹配');
			return false;
		}else{
			$error.eq(1).html('')
		}
	})
})(jQuery)