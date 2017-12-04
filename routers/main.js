var express = require('express')
var router = express.Router()
var Category = require('../models/Category')
var Content = require('../models/Content')
var data = {}
router.use(function(req, res, next) {
    data = {
        categories: [],
        userInfo: req.userInfo
    }
    Category.find().then(function (categories) {
        data.categories = categories
        next()   
    })
})
router.get('/', function(req,res,next){
    var category = req.query.category || ''
    var where = {}
    if (category) {
        where.category = category
    }
    Content.where(where).count().then(function(count){
        data.count = count
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
        data.pageList = pageList
        data.pageNum = pageNum
        if (category) {
            data.url = '/?category=' + category + '&page='   
        } else {
            data.url = '/'         
        }
        data.category = category
        
        Content.where(where).find().limit(limit).skip(skip).populate(['category', 'user']).sort({
            addTime: -1
        }).then(function(contents){
            data.contents = contents
            res.render('main/index', data)
        })
    })
})
router.get('/view', function(req, res, next){
    var contentId = req.query.contentid || ''
    Content.findOne({
        _id: contentId
    }).populate('user').then(function(result){
        console.log(result, '啊啊')
        data.category = result.category       
        data.content = result
        result.views++
        return result.save()
    }).then(function(){
        res.render('main/view', data)                
    })
})







module.exports = router