express = require('express')
const Unit = require('../classes/unit')
const db = require('../database/db-connector')
const insert_unit = db.insert_unit
const select_unit = db.select_unit
const delete_unit = db.delete_unit
appUnits = express()

appUnits.route('/').get((req, res) => {
    select_unit().then((rows) => {
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
    res.send(`PUT Units data for Unit ${req.params.uid}`)
})

appUnits.route('/:uid').patch((req, res) => {
    res.send(`PATCH Units data for Unit ${req.params.uid}`)
})

appUnits.route('/:uid').delete((req, res) => {
    let unit = new unit({
        "name": req.params.uid
    })
    select_unit(unit).then((rows) => {
        delete_unit(unit).then((_rows) => {
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

module.exports = appUnits