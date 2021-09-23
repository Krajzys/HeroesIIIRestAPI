express = require('express')
const Building = require('../classes/building')
const Cost = require('../classes/cost')
const db = require('../database/db-connector')
const insert_building = db.insert_building
const select_building = db.select_building
const delete_building = db.delete_building
const update_building = db.update_building
const extend = require('lodash/extend')
appBuildings = express()

appBuildings.route('/').get((req, res) => {
    select_building(new Building(), req.query).then((rows) => {
        res.status(200)
        res.send(rows)
    }).catch((err) => {
        res.status(500)
        res.send(err.message)
    })
})

appBuildings.route('/:bid&:cid').get((req, res) => {
    let building = new Building({name: req.params.bid, castle_name: req.params.cid})
    select_building(building).then((rows) => {
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
    let {requirements, ...building} = new Building(req.body)
    let old_building = new Building({name: req.params.bid, castle_name: req.params.cid})
    update_building(building, old_building).then((rows) => {
        res.status(200)
        res.send(rows)
    }).catch((err)=> {
        res.status(500)
        res.send(err.message)
    })
})

appBuildings.route('/:bid&:cid').patch((req, res) => {
    let update_properties = req.body
    let building = new Building({name: req.params.bid, castle_name: req.params.cid})
    select_building(building).then((rows) => {
        if (rows.length > 0) {
            let {last_date_modified, ...building} = rows[0]
            let building_update = {}
            Object.assign(building_update, building)
            extend(building_update, update_properties)
            update_building(building_update, building, true).then((rows) => {
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