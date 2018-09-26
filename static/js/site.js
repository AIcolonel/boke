(function($){
	$('.btn-remove').on('click',function(){
		$(this.parentNode).remove();
	})

	$('.btn-add').on('click',function(){
		var $dom=$(this).siblings().eq(0).clone(true);
		// console.log($dom);
		$dom.find('input').val('');
		$dom.prependTo($(this.parentNode));
	})
})(jQuery)