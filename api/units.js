express = require('express')
const Unit = require('../classes/unit')
const db = require('../database/db-connector')
const insert = db.insert
const select = db.select
appUnits = express()

appUnits.route('/').get((req, res) => {
    res.status(200)
    select('unit', new Unit())
    res.send('OK')
})

appUnits.route('/').post((req, res) => {
    let unit = new Unit(req.body)
    try {
        insert('unit', [unit])
        res.json(unit)
    } catch (e) {
        console.error(e)
        res.json('There was an error')
    }
})

appUnits.route('/:uid').put((req, res) => {
    res.send(`PUT Units data for Unit ${req.params.uid}`)
})

appUnits.route('/:uid').patch((req, res) => {
    res.send(`PATCH Units data for Unit ${req.params.uid}`)
})

appUnits.route('/:uid').delete((req, res) => {
    res.send(`DELETE Units data for Unit ${req.params.uid}`)
})

module.exports = appUnits