express = require('express')
const Player = require('../classes/player')
const db = require('../database/db-connector')
const insert_player = db.insert_player
const select_player = db.select_player
const delete_player = db.delete_player
appPlayers = express()

appPlayers.route('/').get((req, res) => {
    select_player().then((rows) => {
        res.status(200)
        res.send(rows)
    }).catch((err) => {
        res.status(500)
        res.send(err.message)
    })
})

appPlayers.route('/').post((req, res) => {
    let player = new Player(req.body)
    insert_player([player]).then((rows) => {
        res.status(200)
        res.send(player)
    }).catch((err)=> {
        res.status(500)
        res.send(err.message)
    })
})

appPlayers.route('/:pid').put((req, res) => {
    res.send(`PUT Players data for Player ${req.params.pid}`)
})

appPlayers.route('/:pid').patch((req, res) => {
    res.send(`PATCH Players data for Player ${req.params.pid}`)
})

appPlayers.route('/:pid').delete((req, res) => {
    let player = new Player({
        "name": req.params.pid
    })
    select_player(player).then((rows) => {
        delete_player(player).then((_rows) => {
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

module.exports = appPlayers