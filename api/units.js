express = require('express')
const Unit = require('../classes/unit')
const db = require('../database/db-connector')
const insert_unit = db.insert_unit
const select_unit = db.select_unit
const delete_unit = db.delete_unit
const update_unit = db.update_unit
const extend = require('lodash/extend')
appUnits = express()

appUnits.route('/').get((req, res) => {
    select_unit(new Unit(), req.query).then((rows) => {
        res.status(200)
        res.send(rows)
    }).catch((err) => {
        res.status(500)
        res.send(err.message)
    })
})

appUnits.route('/:uid').get((req, res) => {
    let unit = new Unit({name: req.params.uid})
    select_unit(unit).then((rows) => {
        res.status(200)
        res.send(rows)
    }).catch((err) => {
        res.status(500)
        res.send(err.message)
    })
})

appUnits.route('/').post((req, res) => {
    let unit = new Unit(req.body)
    insert_unit([unit]).then((rows) => {
        res.status(200)
        res.send(unit)
    }).catch((err)=> {
        res.status(500)
        res.send(err.message)
    })
})

appUnits.route('/:uid').put((req, res) => {
    let {requirements, ...unit} = new Unit(req.body)
    let old_unit = new Unit({name: req.params.uid})
    update_unit(unit, old_unit).then((rows) => {
        res.status(200)
        res.send(rows)
    }).catch((err)=> {
        res.status(500)
        res.send(err.message)
    })
})

appUnits.route('/:uid').patch((req, res) => {
    let update_properties = req.body
    let unit = new Unit({name: req.params.uid})
    select_unit(unit).then((rows) => {
        if (rows.length > 0) {
            let {last_date_modified, ...unit} = rows[0]
            let unit_update = {}
            Object.assign(unit_update, unit)
            extend(unit_update, update_properties)
            update_unit(unit_update, unit, true).then((rows) => {
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

appUnits.route('/:uid').delete((req, res) => {
    let unit = new Unit({
        name: req.params.uid
    })
    delete_unit(unit).then((rows) => {
        if (rows.affectedRows === 0) {
            res.status(404)
            res.send('Requested resource cannot be found')
            return
        }
        res.status(200)
        res.send(rows)
    }).catch((err) => {
        res.status(500)
        res.send(err.message)
    })
})

module.exports = appUnits