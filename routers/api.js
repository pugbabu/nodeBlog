var express = require('express')
var router = express.Router()
var responseData;
var User = require('../models/User.js')
var Content = require('../models/Content')
router.use(function(req, res,next){
  responseData = {
    code: 0,
    msg: ''
  }
  next()
})
router.post('/user/login', function(req, res, next) {
  var username = req.body.username
  var password = req.body.password
  User.findOne({
    username: username,
    password: password
  }).then(function(userInfo) {
    if (!userInfo) {
      console.log('不允许登陆')
      responseData.code = 5
      responseData.msg = '用户名或密码错误'
      res.json(responseData)
      return
    }
    responseData.code = 1001
    responseData.userInfo = {
      id: userInfo.id,
      username: userInfo.username
    }
    req.cookies.set('userInfo', JSON.stringify({
      id: userInfo.id,
      username: userInfo.username,
      isAdmin: userInfo.isAdmin
    }))
    responseData.msg = '登陆成功'
    res.json(responseData)
  })
})
router.post('/user/logout', function(req, res, next) {
  req.cookies.set('userInfo', null)
  responseData.code = 6
  responseData.msg = '清除cookie'
  responseData.userInfo = {}
  res.json(responseData)
})
router.post('/user/register', function(req,res,next){
  var username = req.body.username
  var password = req.body.password
  var repassword = req.body.repassword
  if (!username) {
    responseData.code = 1;
    responseData.msg = '用户名不能为空'
    res.json(responseData)
    return
  }
  if (!password) {
    responseData.code = 2;
    responseData.msg = '密码不能为空'
    res.json(responseData)
    return
  }
  if (password != repassword) {
    responseData.code = 3;
    responseData.msg = '两次输入密码不一致'
    res.send(responseData)
    return
  }
  User.findOne({
    username: username
  }).then(function(userInfo) {
    if (userInfo) {
      responseData.code = 4
      responseData.msg = '用户名已注册'
      res.json(responseData)
      return
    } 
    var user = new User({
      username: username,
      password: password
    })
    return user.save()
  }).then(function(){
    responseData.code = 1000
    responseData.msg = '注册成功'
    res.json(responseData)
  })
})
// 添加评论
router.post('/comment/post', function(req, res, next) {
  var contentId = req.body.contentId || ''
  var comment = req.body.comment || ''
  var postData = {
    userName: req.userInfo.username,
    postTime: new Date(),
    postComment: comment
  }
  if (!comment) {
    responseData.msg = '评论不能为空'
    res.json(responseData)
    return
  }
  Content.findOne({
    _id: contentId
  }).then(function(content) {
    content.comments.push(postData)
    return content.save()
  }).then(function(){
    console.log('哈哈')
    responseData.code = 1000
    responseData.msg = '评论成功'
    res.json(responseData)
  })
})

module.exports = router