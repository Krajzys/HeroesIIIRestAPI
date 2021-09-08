express = require('express')
const Building = require('../classes/buidling')
const db = require('../database/db-connector')
const insert = db.insert
const select = db.select
appBuildings = express()

appBuildings.route('/').get((req, res) => {
    req.params
    res.status(200)
    select('building', new Building())
    res.send('OK')
})

appBuildings.route('/').post((req, res) => {
    let building = new Building(req.body)
    try {
        insert('building', [building])
        res.json(building)
    } catch (e) {
        console.error(e)
        res.json('There was an error')
    }
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