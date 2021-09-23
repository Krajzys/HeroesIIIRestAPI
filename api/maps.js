express = require('express')
const Map = require('../classes/map')
const db = require('../database/db-connector')
const insert_map = db.insert_map
const select_map = db.select_map
const delete_map = db.delete_map
const update_map = db.update_map
const extend = require('lodash/extend')
appMaps = express()

appMaps.route('/').get((req, res) => {
    select_map(new Map(), req.query).then((rows) => {
        res.status(200)
        res.send(rows)
    }).catch((err) => {
        res.status(500)
        res.send(err.message)
    })
})

appMaps.route('/:mid').get((req, res) => {
    let map = new Map({name: req.params.mid})
    select_map(map).then((rows) => {
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
    let {requirements, ...map} = new Map(req.body)
    let old_map = new Map({name: req.params.mid})
    update_map(map, old_map).then((rows) => {
        res.status(200)
        res.send(rows)
    }).catch((err)=> {
        res.status(500)
        res.send(err.message)
    })
})

appMaps.route('/:mid').patch((req, res) => {
    let update_properties = req.body
    let map = new Map({name: req.params.mid})
    select_map(map).then((rows) => {
        if (rows.length > 0) {
            let {last_date_modified, ...map} = rows[0]
            let map_update = {}
            Object.assign(map_update, map)
            extend(map_update, update_properties)
            update_map(map_update, map, true).then((rows) => {
                if (rows.affectedRows === 0) {
                    res.status(404)
                    res.send('You must specify latest last_date_modified inside your request body.')
                    return
                }
                res.status(200)
                res.send(rows)
            }).catch((err)=> {
                res.status(500)
                res.send(err.message)
            })
        }
        else {
            res.status(404)
            res.send('Requested resource cannot be found')
        }
    }).catch((err) => {
        res.status(500)
        res.send(err.message)
    })
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