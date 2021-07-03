const mongoose = require('mongoose')

var TagList = mongoose.model('TagList',
{
    tag : { type: String },
    
})

module.exports = { TagList }