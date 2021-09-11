express = require('express')
const Game = require('../classes/game')
const db = require('../database/db-connector')
const insert_game = db.insert_game
const select_game = db.select_game
appGames = express()

appGames.route('/').get((req, res) => {
    select_game().then((rows) => {
        res.status(200)
        res.send(rows)
    }).catch((err) => {
        res.status(500)
        res.send(err.message)
    })
})

appGames.route('/').post((req, res) => {
    let game = new Game(req.body)
    insert_game([game]).then((rows) => {
        res.status(200)
        res.send(game)
    }).catch((err)=> {
        res.status(500)
        res.send(err.message)
    })
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