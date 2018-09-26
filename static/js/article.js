(function($){
	ClassicEditor
   	.create( document.querySelector( '#editor' ),{
        language:'zh-cn',
        	ckfinder: {
        		uploadUrl : '/admin/uploadImages'
   			}
        } )
   	.then(editor=>{
   		window.editor=editor;
   	})
    .catch( error => {
        console.error( error );
    });

    $('#btn-sub').on('click',function(){
    	var $err=$('.errmsg');
		var cateTitle=$('[name="title"]').val();
		var cateIntro=$('[name="intro"]').val();
		var cateContent=editor.getData();
		// console.log(cateContent);
		if(cateTitle.trim() == ''){
			$err.eq(0).html('标题名称不能为空！！！')
			return false;
		}
		$err.eq(0).html('');

		if(cateIntro.trim() == ''){
			$err.eq(1).html('简介不能为空！！！')
			return false;
		}
		$err.eq(1).html('');

		if(cateContent.trim() == '<p>&nbsp;</p>'){
			$err.eq(2).html('内容不能为空！！！')
			return false;
		}
		$err.eq(2).html('');
	})
})(jQuery)