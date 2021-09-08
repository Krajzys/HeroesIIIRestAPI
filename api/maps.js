express = require('express')
const Map = require('../classes/map')
const db = require('../database/db-connector')
const insert = db.insert
const select = db.select
appMaps = express()

appMaps.route('/').get((req, res) => {
    res.send("Maps data")
})

appMaps.route('/').post((req, res) => {
    let map = new Map(req.body)
    try {
        insert('map', [map])
        res.json(map)
    } catch (e) {
        console.error(e)
        res.json('There was an error')
    }
})

appMaps.route('/:mip').put((req, res) => {
    res.send(`PUT Maps data for Map ${req.params.mip}`)
})

appMaps.route('/:mip').patch((req, res) => {
    res.send(`PATCH Maps data for Map ${req.params.mip}`)
})

appMaps.route('/:mip').delete((req, res) => {
    res.send(`DELETE Maps data for Map ${req.params.mip}`)
})

module.exports = appMaps