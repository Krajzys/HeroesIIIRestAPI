express = require('express')
const Map = require('../classes/map')
const db = require('../database/db-connector')
const insert_map = db.insert_map
const select_map = db.select_map
const delete_map = db.delete_map
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

appMaps.route('/:mid').put((req, res) => {
    res.send(`PUT Maps data for Map ${req.params.mid}`)
})

appMaps.route('/:mid').patch((req, res) => {
    res.send(`PATCH Maps data for Map ${req.params.mid}`)
})

appMaps.route('/:mid').delete((req, res) => {
    let map = new Map({
        "name": req.params.mid
    })
    select_map(map).then((rows) => {
        delete_map(map).then((_rows) => {
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

module.exports = appMaps