express = require('express')
const Game = require('../classes/game')
const db = require('../database/db-connector')
const insert = db.insert
const select = db.select
appGames = express()

appGames.route('/').get((req, res) => {
    res.send("Games data")
})

appGames.route('/').post((req, res) => {
    let game = new Game(req.body)
    try {
        insert('game', [game])
        res.json(game)
    } catch (e) {
        console.error(e)
        res.json('There was an error')
    }
})

appGames.route('/:gid').put((req, res) => {
    res.send(`PUT Games data for Game ${req.params.gid}`)
})

appGames.route('/:gid').patch((req, res) => {
    res.send(`PATCH Games data for Game ${req.params.gid}`)
})

appGames.route('/:gid').delete((req, res) => {
    res.send(`DELETE Games data for Game ${req.params.gid}`)
})

module.exports = appGames