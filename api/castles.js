express = require('express')
const Castle = require('../classes/castle')
const db = require('../database/db-connector')
const insert_castle = db.insert_castle
const select_castle = db.select_castle
const delete_castle = db.delete_castle
appCastles = express()

appCastles.route('/').get((req, res) => {
    select_castle().then((rows) => {
        res.status(200)
        res.send(rows)
    }).catch((err) => {
        res.status(500)
        res.send(err.message)
    })
})

appCastles.route('/').post((req, res) => {
    let castle = new Castle(req.body)
    insert_castle([castle]).then((rows) => {
        res.status(200)
        res.send(castle)
    }).catch((err)=> {
        res.status(500)
        res.send(err.message)
    })
})

appCastles.route('/:cid').put((req, res) => {
    res.send(`PUT Castles data for castle ${req.params.cid}`)
})

appCastles.route('/:cid').patch((req, res) => {
    res.send(`PATCH Castles data for castle ${req.params.cid}`)
})

appCastles.route('/:cid').delete((req, res) => {
    let castle = new Castle({
        "name": req.params.cid
    })
    select_castle(castle).then((rows) => {
        delete_castle(castle).then((_rows) => {
            res.status(200)
            res.send(rows)
        }).catch((err) => {
            res.status(500)
            res.send(err.message)
        })
    }).catch((err) => {
        res.status(500)
        res.send(err.message)
    })
})

module.exports = appCastles