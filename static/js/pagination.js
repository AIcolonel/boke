(function($){
	// 将分页的功能剥离出去，做成一个插件
	$.fn.extend({
		pagination:function(){
			// 处理点击页码请求
			var self=this;
			this.on('click','a',function(){
				// console.log(this);
				var page=1;
				var $this=$(this);
				var currentPage=self.find('.active a').html();

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

				var query=self.data('url')+'?page='+page;
				var id=self.data('id');

				if(id){
					query+= '&id='+id;
				}

				$.ajax({
					url:query,
					type:'GET',
					dataType:'json'
				})
				.done(function(result){
					// console.log(result);
					if(result.code==0){//操作成功
						// createArticleList(result.data.docs);
						// buildPage(result.data.list,result.data.page);
						self.trigger('get-data',[result]);
					}
				})
				.fail(function(err){
					console.log(err);
				})
			})
		}
	})
})(jQuery)