# blog
my blog第二次更新版本,主要采用nodejs+express+nunjucks+mongodb搭建，前台页面使用nunjucks做模板引擎，node+express后台，文件上传下载使用multer，加密用到webjsontoken，和md5，邮件自动发送用到nodemailer,后台ajax请求用到axios，主要功能文章，留言，评论的增删改查，访客人员ip及地区统计，登录权限控制，github，qq第三方登录，找回密码自动发送邮件等功能。

使用者需要更改数据库用户，github api和qq互联的appid
后台访问需要在数据库中添加一条超级管理员，才可以进后台

安装模块

npm instal

开启node服务器

node app.js

然后看监听的端口，浏览器访问就可以，端口啥的就不多说了

