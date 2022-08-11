
'use strict'

// hexo.extend.filter.register('before_generate', function () {
//   const posts = this.locals.get('posts');
//   //找到所有hide标记为true的文章
//   const hide_posts = this.locals.get('posts').find({ 'type': "handredday" });
//   //过滤hide文章
//   const normal_posts = this.locals.get('posts').filter(post => !post['hide']);

//   this.locals.set('all_posts', posts);
//   //更新生成的文章为过滤后的文章
//   this.locals.set('hide_posts', hide_posts);
//   //页面调用时获取的数据就是这个
//   this.locals.set('posts', normal_posts);
// })