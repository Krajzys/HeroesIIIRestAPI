express = require('express')
const Castle = require('../classes/castle')
const db = require('../database/db-connector')
const insert = db.insert
const select = db.select
appCastles = express()

appCastles.route('/').get((req, res) => {
    res.send("Castles data")
})

appCastles.route('/').post((req, res) => {
    let castle = new Castle(req.body)
    try {
        insert('castle', [castle])
        res.json(castle)
    } catch (e) {
        console.error(e)
        res.json('There was an error')
    }
})

appCastles.route('/:cid').put((req, res) => {
    res.send(`PUT Castles data for castle ${req.params.cid}`)
})

appCastles.route('/:cid').patch((req, res) => {
    res.send(`PATCH Castles data for castle ${req.params.cid}`)
})

appCastles.route('/:cid').delete((req, res) => {
    res.send(`DELETE Castles data for castle ${req.params.cid}`)
})

module.exports = appCastles