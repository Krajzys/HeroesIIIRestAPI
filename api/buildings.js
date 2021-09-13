express = require('express')
const Building = require('../classes/buidling')
const Cost = require('../classes/cost')
const db = require('../database/db-connector')
const insert_building = db.insert_building
const select_building = db.select_building
const delete_building = db.delete_building
appBuildings = express()

appBuildings.route('/:bid?&?:cid?').get((req, res) => {
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

appBuildings.route('/:bid&:cid').put((req, res) => {
    res.send(`PUT Buildings data for Building ${req.params.bid} ${req.params.cid}`)
})

appBuildings.route('/:bid&:cid').patch((req, res) => {
    res.send(`PATCH Buildings data for Building ${req.params.bid} ${req.params.cid}`)
})

appBuildings.route('/:bid&:cid').delete((req, res) => {
    let building = new Building({
        "name": req.params.bid,
        "castle_name": req.params.cid
    })
    select_building(building).then((rows) => {
        delete_building(building).then((_rows) => {
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

module.exports = appBuildings