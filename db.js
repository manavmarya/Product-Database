const mongoose = require('mongoose')

var uri = 'mongodb+srv://manavmarya:kinshuk786@cluster0.y1cjp.mongodb.net/productDB?authSource=admin&replicaSet=atlas-pffthl-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true'

mongoose.connect(uri, {useNewUrlParser:true, useUnifiedTopology:true}, 
    err => {
        if(err)
            console.log('Error : ' + JSON.stringify(err, undefined, 2))
        else 
            console.log('Connection Success')
    })