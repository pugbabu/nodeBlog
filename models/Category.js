var mongoose = require('mongoose')
var categoriesSchema = require('../schemas/category')
module.exports = mongoose.model('Category', categoriesSchema)