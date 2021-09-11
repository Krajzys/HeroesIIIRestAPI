express = require('express')
const Map = require('../classes/map')
const db = require('../database/db-connector')
const insert_map = db.insert_map
const select_map = db.select_map
appMaps = express()

appMaps.route('/').get((req, res) => {
    select_map().then((rows) => {
        res.status(200)
        res.send(rows)
    }).catch((err) => {
        res.status(500)
        res.send(err.message)
    })
})

appMaps.route('/').post((req, res) => {
    let map = new Map(req.body)
    insert_map([map]).then((rows) => {
        res.status(200)
        res.send(map)
    }).catch((err)=> {
        res.status(500)
        res.send(err.message)
    })
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