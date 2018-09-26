(function($){ 
	$('#comment-btn').on('click',function(){
		var articleId=$('#article-id').val();
		var commentContent=$('#comment-content').val();

		if(commentContent.trim() == ''){
			$('.errmsg').html('评论内容不能为空');
			return false;
		}else{
			$('.errmsg').html('');
		}
 
		// 发送ajax请求
		$.ajax({
			url:'/comment/add',
			type:'POST',
			dataType:'json',
			data:{id:articleId,content:commentContent}
		})
		.done(function(result){
			// 
			if(result.code == 0){
				createCommentList(result.data.docs);
				buildPage($commentPage,result.data.list,result.data.page);
				$('#comment-content').val('');
				window.location.reload();
			}
		})
		.fail(function(err){
			console.log(err);
		})
	})

	// 处理点击页码请求
	var $commentPage=$('#comment-page');
	$commentPage.on('get-data',function(ev,result){
		if(result.code==0){//操作成功
			createCommentList(result.data.docs);
			buildPage($commentPage,result.data.list,result.data.page);
		}
	})
	$commentPage.pagination();


	// 构建评论列表
	function createCommentList(comment){
		var html='';
		for(var i=0;i<comment.length;i++){
			var date = moment(comment[i].createAt).format('YYYY年MM月DD日 HH:mm:ss ');
			html+=`
				<div class="panel panel-default">
				  	<div class="panel-heading">
				  	${ comment[i].user.username } 发表于 ${ date }
				  	</div>
				  	<div class="panel-body">
				    	${ comment[i].content }
				  	</div>
				</div>
			`
		}

		$('#comment-list').html(html);
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
})(jQuery)