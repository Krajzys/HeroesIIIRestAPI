express = require('express')
const Building = require('../classes/buidling')
const db = require('../database/db-connector')
const con = db.con
const insert = db.insert
appBuildings = express()

appBuildings.route('/').get((req, res) => {
    res.send("Buildings data")
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
    console.log(building)
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