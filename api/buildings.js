const { con } = require('../database/db-connector')

express = require('express')
db = require('../database/db-connector')
appBuildings = express()

appBuildings.route('/').get((req, res) => {
    res.send("Buildings data")
})

appBuildings.route('/').post((req, res) => {
    res.send(`POST Buildings data for Building`)
})

appBuildings.route('/:bid').put((req, res) => {
    res.send(`PUT Buildings data for Building ${req.params.bid}`)
})

appBuildings.route('/:bid').patch((req, res) => {
    res.send(`PATCH Buildings data for Building ${req.params.bid}`)
})

appBuildings.route('/:bid').delete((req, res) => {
    res.send(`DELETE Buildings data for Building ${req.params.bid}`)
})

module.exports = appBuildings