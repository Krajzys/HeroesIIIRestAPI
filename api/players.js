express = require('express')
appPlayers = express()

appPlayers.route('/').get((req, res) => {
    res.send("Players data")
})

appPlayers.route('/').post((req, res) => {
    res.send(`POST Players data for Player`)
})

appPlayers.route('/:pid').put((req, res) => {
    res.send(`PUT Players data for Player ${req.params.pid}`)
})

appPlayers.route('/:pid').patch((req, res) => {
    res.send(`PATCH Players data for Player ${req.params.pid}`)
})

appPlayers.route('/:pid').delete((req, res) => {
    res.send(`DELETE Players data for Player ${req.params.pid}`)
})

module.exports = appPlayers