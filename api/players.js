express = require('express')
const Player = require('../classes/player')
const db = require('../database/db-connector')
const insert = db.insert
const select = db.select
appPlayers = express()

appPlayers.route('/').get((req, res) => {
    res.send("Players data")
})

appPlayers.route('/').post((req, res) => {
    let player = new Player(req.body)
    try {
        insert('player', [player])
        res.json(player)
    } catch (e) {
        console.error(e)
        res.json('There was an error')
    }
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