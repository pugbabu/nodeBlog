var express = require('express')
var router = express.Router()
var User = require('../models/User')
var Category = require('../models/Category')
var Content = require('../models/Content')
router.use(function(req, res, next){
    if (!req.userInfo.isAdmin) {
        res.send('对不起，你不是管理员，暂无权限操作')
        return  
    }
    next()
})
router.get('/', function(req,res,next) {
    res.render('admin/index', {
        userInfo: req.userInfo,
    })
    
})
router.get('/user', function(req, res, next) {
    var pageNum = Number(req.query.page || 1)
    var limit = 3
    var pageTotal = 0
    var pageList = []
    var skip = 0
    User.count().then(function(count) {
        pageTotal = Math.ceil(count / limit)
        pageNum = Math.min(pageTotal, pageNum)
        pageNum = Math.max(1, pageNum)
        for (var i = 0; i < pageTotal; i++) {
            pageList.push(i+1)
        }
        skip = (pageNum - 1) * limit
        User.find().limit(limit).skip(skip).then(function(users) {
            res.render('admin/user_index', {
                users: users,
                count: count,
                pageTotal: pageTotal,
                pageList: pageList,
                pageNum: pageNum,
                userInfo: req.userInfo,
                url: '/admin/user'
            })
        })
    })
})
router.get('/category', function(req, res, next) {
    Category.count().then(function(count){
        var pageNum = Number(req.query.page || 1)
        var limit = 3
        var pageTotal = 0
        var pageList = []
        var skip = 0
        pageTotal = Math.ceil(count / limit)
        pageNum = Math.min(pageTotal, pageNum)
        pageNum = Math.max(1, pageNum)
        for (var i = 0; i < pageTotal; i++) {
            pageList.push(i+1)
        }
        skip = (pageNum - 1) * limit
        Category.find().limit(limit).skip(skip).then(function(categories){
            console.log(categories, categories.length)
            res.render('admin/category_index', {
                userInfo: req.userInfo,
                categories: categories,
                pageTotal: pageTotal,
                pageList: pageList,
                pageNum: pageNum,
                url: '/admin/category'
            })
        })
    })
    
    
})

router.get('/category/add', function(req, res, next) {
    res.render('admin/category_add', {
        userInfo: req.userInfo
    })
})
router.post('/category/add', function(req, res, next) {
    var name = req.body.name || ''
    Category.findOne({
        name: name
    }).then(function(categoryName) {
        if (categoryName) {
            console.log('有咯')
            res.render('admin/error', {
                msg: '该分类已存在'
            })
            return Promise.reject()
        }
        return new Category({
            name: name
        }).save()
    }).then(function(){
        res.render('admin/success',{
            msg: '添加成功',
            url: '/admin/category'
        })
    })
})
router.get('/category/edit', function(req, res, next) {
    var id = req.query.id || ''
    Category.findOne({
        _id: id
    }).then(function(category) {
        if (!category) {
            res.render('admin/error', {
                userInfo: req.userInfo,
                msg: '分类信息不存在'
            })
            return Promise.reject()
        }
        return res.render('admin/category_edit', {
            name: category.name
        })
    })  
})
router.post('/category/edit', function(req, res, next) {
    var id = req.query.id
    var name = req.body.name || ''
    Category.findOne({
        _id: id
    }).then(function(category) {
        if (!category) {
            res.render('admin/error', {
                msg: '该分类不存在',
                userInfo: req.userInfo
            })
            return Promise.reject()
        } else {
            if (name == category.name) {
                res.render('admin/error', {
                    userInfo: req.userInfo,
                    msg: '修改成功',
                    url: '/admin/category'
                })
                return Promise.reject()
            } else {
                return Category.findOne({
                    _id: {$ne: id},
                    name: name
                })
            }
        }     
    }).then(function(same){
        if (same) {
            res.render('admin/error', {
                userInfo: req.userInfo,
                msg: '已存在同名分类'
            })
            return Promise.reject()
        } else {
            return Category.update({
                _id: id
            },{
                name: name
            })
        }
    }).then(function(){
        res.render('admin/success', {
            userInfo: req.userInfo,
            msg: '修改成功',
            url: '/admin/category'
        })
        return Promise.reject()
    })
})

router.get('/category/delete', function(req, res, next) {
    var id = req.query.id
    Category.remove({
        _id: id
    }).then(function() {
        console.log('删除成功')
        res.render('admin/success', {
            msg: '删除成功',
            url: '/admin/category',
            userInfo: req.userInfo
        })
    })
})
router.get('/content', function(req, res, next) {
    Content.count().then(function(count){
        var pageNum = Number(req.query.page || 1)
        var limit = 3
        var pageTotal = 0
        var pageList = []
        var skip = 0
        pageTotal = Math.ceil(count / limit)
        pageNum = Math.min(pageTotal, pageNum)
        pageNum = Math.max(1, pageNum)
        for (var i = 0; i < pageTotal; i++) {
            pageList.push(i+1)
        }
        skip = (pageNum - 1) * limit     
        console.log('大的负担')   
        Content.find().limit(limit).skip(skip).populate(['category', 'user']).then(function(contents) {
            console.log(contents, '嗯哼')
            res.render('admin/content_index', {
                userInfo: req.userInfo,
                contents: contents,
                pageList: pageList,
                pageTotal: pageTotal,
                pageNum: pageNum,
                url: '/admin/content'
            })
        })
    })
    
    
})
router.get('/content/add', function(req, res, next) {
    Category.find().then(function(categories){
        res.render('admin/content_add', {
            userInfo: req.userInfo,
            categories: categories
        })
    })

    
    
})

router.post('/content/add', function(req,res,next) {
    console.log(res.body)
    if (req.body.title == '') {
        res.render('admin/error', {
            msg: '分类标题不能为空',
            userInfo: req.userInfo
        })
        return
    }
    if (req.body.description == '') {
        res.render('admin/error', {
            userInfo: req.userInfo,
            msg: '内容简介不能为空'
        })
        return
    }
    if (req.body.content == '') {
        res.render('admin/error', {
            userInfo: req.userInfo,
            msg: '内容信息不能为空'
        })
        return
    }
    console.log(req.userInfo, 'df')
    new Content({
        category: req.body.category,
        user: req.userInfo.id,
        title: req.body.title,
        description: req.body.description,
        content: req.body.content
    }).save().then(function(){
        console.log('添加成功')
        res.render('admin/success', {
            userInfo: req.userInfo,
            msg: '内容添加成功',
            url: '/admin/content'
        })
    })
})

router.get('/content/edit', function(req, res, next) {
    var categories = []
    Category.find().then(function(rs){
        categories = rs
        return Content.findOne({
            _id: req.query.id
        }).populate('category')
    }).then(function(contents){
        console.log(contents, '嘎嘎嘎')
        if (!contents) {
            res.render('admin/error', {
                msg: '该文章不存在',
                userInfo: req.userInfo
            })
            return Promise.reject()
        } else {
            console.log('是否执行')
            res.render('admin/content_edit', {
                userInfo: req.userInfo,
                contents: contents,
                categories: categories
            })
        } 
    })
   
    
})

router.post('/content/edit', function(req, res, next) {
    console.log(req.body.id, '大家都')
    var id = req.body.id || ''
    console.log(req.body, '秀个 i')
    console.log(req.body, '大口大口')
    if (req.body.title == '') {
        res.render('admin/error', {
            userInfo: req.userInfo,
            msg: '标题不能为空'
        })
        return
    }
    if (req.body.description == '') {
        res.render('admin/error', {
            userInfo: req.userInfo,
            msg: '简介不能为空'
        })
        return
    }
    if (req.body.content == '') {
        res.render('admin/error', {
            userInfo: req.userInfo,
            msg: '内容不能为空'
        })
        return
    }
    console.log(req.body.category, '改改')
    Content.update({
        _id: id
    },{
        category: req.body.category,
        title: req.body.title,
        description: req.body.description,
        content: req.body.content
    }).then(function(){
        res.render('admin/success', {
            userInfo: req.userInfo,
            msg: '修改成功',
            url: '/admin/content'
        })
    })
})
router.get('/content/delete', function(req,res,next){
    var id = req.query.id || ''
    Content.remove({
        _id: id
    }).then(function(){
        res.render('admin/success',{
            msg: '删除成功',
            userInfo: req.userInfo,
            url: '/admin/content'
        })
    })
})


module.exports = router