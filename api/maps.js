express = require('express')
appMaps = express()

appMaps.route('/').get((req, res) => {
    res.send("Maps data")
})

appMaps.route('/').post((req, res) => {
    res.send(`POST Maps data for Map`)
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