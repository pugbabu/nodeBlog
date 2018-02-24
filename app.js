//加载express模块
var express = require('express')

//加载模版处理模块
var swig = require('swig')

//加载body-parser，用来处理post提交过来的数据
var bodyParser = require('body-parser')

//加载cookies
var Cookies = require('cookies')

//加载数据库模块
var mongoose = require('mongoose')

//创建app应用 => Nodejs 中Http.createServer()
var app = express()

//设置静态文件托管
app.use('/public', express.static(__dirname + '/public'))

//配置应用模版
//定义当前应用所使用的模版引擎
//第一个参数：模版引擎都名称，同时也是模版文件的后缀，第二个参数用于解析处理模版内容的方法
app.engine('html', swig.renderFile)

//设置模版文件的存放目录，第一个参数必须是views，第二个参数是目录·
app.set('views', './views')
//注册所使用的模版,第一个参数必须是view enginne，第二个参数是模版引擎名称
app.set('view engine', 'html')
//在开发过程中，需要取消模版缓存
swig.setDefaults({
  cache: false
})

//bodyParser设置
app.use(bodyParser.urlencoded({
  extended: true
}))

//设置cookies
app.use(function(req, res, next) {
  req.cookies = new Cookies(req, res)
  //解析用户登录
  req.userInfo = {}  
  if (req.cookies.get('userInfo')) {
    try{
      req.userInfo = JSON.parse(req.cookies.get('userInfo'))    
    } catch(e) {
      next()
    }
  }
  next()
})

//根据不同的功能划分模块
app.use('/admin', require('./routers/admin')) //后台管理
app.use('/api', require('./routers/api')) //api接口
app.use('/', require('./routers/main')) //前台模块

//监听app请求
mongoose.connect('mongodb://127.0.0.1:27017/blog', function (err) {
  if (err) {
    console.log('数据库连接失败')
  } else {
    console.log('数据库连接成功')
    app.listen(80)
  }
})
