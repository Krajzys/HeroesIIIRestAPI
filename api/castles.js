express = require('express')
appCastles = express()

appCastles.route('/').get((req, res) => {
    res.send("Castles data")
})

appCastles.route('/').post((req, res) => {
    res.send(`POST Castles data for castle`)
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