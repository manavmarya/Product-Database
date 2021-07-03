const mongoose = require('mongoose')

var Product = mongoose.model('Product',
{
    title : { type: String },
    price : { type: Number },
    tags : [
        { type: String },
    ]
    
})

module.exports = { Product }