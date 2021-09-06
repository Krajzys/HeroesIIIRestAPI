express = require('express')
appUnits = express()

appUnits.route('/').get((req, res) => {
    res.send("Units data")
})

appUnits.route('/').post((req, res) => {
    res.send(`POST Units data for Unit`)
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