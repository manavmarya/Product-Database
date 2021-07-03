const express = require('express')
var prouductRouter = express.Router()
var ObjectID = require('mongoose').Types.ObjectId
var { Product } = require('../models/product')
var { TagList } = require('../models/taglist')

prouductRouter.get('/', (req,res) => {
    if (typeof(req.query.page) != "undefined" && typeof(req.query.limit) != "undefined") {
        const page = req.query.page
        const limit = req.query.limit
        const startIndex = (page - 1)* limit
        const endIndex = page * limit
        
        if (typeof(req.query.tags) != "undefined") {
            const tagArray =  req.query.tags.split('#')
            Product.find( { tags: { $all:  tagArray }}, (err,data) => {
                if(!err) {
                    const resultProducts = data.slice(startIndex, endIndex)
                    res.render('profile.ejs', { user : req.user, products: resultProducts  })
                }
                else console.log('Error while retrieving'+ JSON.stringify(err, undefined, 2)) 
            })
        }

        else {
            Product.find((err,data) => {
                if(!err) {
                    const resultProducts = data.slice(startIndex, endIndex)
                    res.render('profile.ejs', { user : req.user, products: resultProducts  })
                }
                else console.log('Error while retrieving'+ JSON.stringify(err, undefined, 2)) 
            })
        }
    }

    else if (typeof(req.query.tags) != "undefined") {
        const tagArray =  req.query.tags.split('#')
            Product.find( { tags: { $all:  tagArray }}, (err,data) => {
                if(!err) {
                    res.render('profile.ejs', { user : req.user, products: data  })
                }
                else console.log('Error while retrieving'+ JSON.stringify(err, undefined, 2)) 
            })
    
    }
    else {        
        Product.find((err,data) => {
            if(!err) {
                res.render('profile.ejs', { user : req.user, products: data  })
            }
            else console.log('Error while retrieving'+ JSON.stringify(err, undefined, 2)) 
        })
    }
})

prouductRouter.get('/aggregate', (req,res) => {
    const tagArray =  req.query.tags.split('#')
    Product.aggregate([
        {
          '$match': {'tags': {'$all': tagArray }}
        }, 
        {
          '$group': {'_id': '$tags' , 
          'count': { '$sum': 1 }}
        },
        {
          '$project': {'_id': 0, 'tag': '$_id', 'count': 1}}
      ], (err, result) => {
            if (err)
                res.send(err);
            res.json(result);
        }
    )
})

prouductRouter.get('/aggregate/avgPrice', (req,res) => {
    const tag =  req.query.tag
    Product.aggregate([
            {
                $unwind: {path: "$tags"}
            },    
            {
              '$match': {"tags": tag }
            }, 
            {
              '$group': {'_id': '$tags', 'avgprice': {'$avg': '$price' }}
            },
            {
              '$project': {'_id': 0, 'tag': '$_id', 'avgprice': 1}
            }
          ], (err, result) => {
            if (err)
                res.send(err);
            res.json(result);
        }
    )
})

prouductRouter.post('/', (req, res) => {
    var tagArray = req.body.tags.split('#')
    var newRecord = new Product({
        title: req.body.title,
        price: req.body.price,
        tags: tagArray
    })

    newRecord.save((err, docs) => {
        if (!err) res.send(docs)
        else console.log('Error while creating new record : ' + JSON.stringify(err, undefined, 2))
    })

    for (var i = 0; i < tagArray.length; i++) {
        var currtag = tagArray[i];
        let query = {tag: currtag};
        let update = { 
            $setOnInsert: { tag: currtag }
        }
        let options = { upsert: true };
        TagList.findOneAndUpdate(query, update, options)
            .catch(error => console.error(error));
    }
})

prouductRouter.put('/:id', (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send('No record with given id : ' + req.params.id)
    var tagArray = req.body.tags.split('#')
    var onlyTagAdd = req.body.onlyTagAdd

    for (var i = 0; i < tagArray.length; i++) {
        var currtag = tagArray[i];
        let query = {tag: currtag};
        let update = { 
            $setOnInsert: { tag: currtag }
        }
        let options = { upsert: true };
        TagList.findOneAndUpdate(query, update, options)
            .catch(error => console.error(error));
    }

    if (onlyTagAdd == 'false') {
        var updatedRecord = {
            title: req.body.title,
            price: req.body.price,
            tags: tagArray
        }
    
        Product.findByIdAndUpdate(req.params.id, { $set: updatedRecord },{new:true}, (err, docs) => {
            if (!err) res.send(docs)
            else console.log('Error while updating a record : ' + JSON.stringify(err, undefined, 2))
        })
    }
    else {
        Product.findByIdAndUpdate(req.params.id, { $push: { tags: { $each: tagArray }}},{new:true}, (err, docs) => {
            if (!err) res.send(docs)
            else console.log('Error while updating a record : ' + JSON.stringify(err, undefined, 2))
        })
    }
})

prouductRouter.delete('/:id', (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send('No record with given id : ' + req.params.id)

    Product.findByIdAndRemove(req.params.id, (err, docs) => {
        if (!err) res.send(docs)
        else console.log('Error while deleting a record : ' + JSON.stringify(err, undefined, 2))
    })
})


module.exports = prouductRouter