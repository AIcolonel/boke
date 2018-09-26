(function($){
	// 验证信息
	$('#btn-sub').on('click',function(){
		var cateName=$('[name="name"]').val();
		if(cateName.trim() == ''){
			$('.errmsg').html('分类名称不能为空！！！')
			return false;
		}

		$('.errmsg').html('')
	})
})(jQuery)