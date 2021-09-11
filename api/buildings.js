express = require('express')
const Building = require('../classes/buidling')
const db = require('../database/db-connector')
const insert_building = db.insert_building
const select_building = db.select_building
appBuildings = express()

appBuildings.route('/').get((req, res) => {
    select_building().then((rows) => {
        res.status(200)
        res.send(rows)
    }).catch((err) => {
        res.status(500)
        res.send(err.message)
    })
})

appBuildings.route('/').post((req, res) => {
    let building = new Building(req.body)
    insert_building([building]).then((rows) => {
        res.status(200)
        res.send(building)
    }).catch((err)=> {
        res.status(500)
        res.send(err.message)
    })
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