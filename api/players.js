express = require('express')
const Player = require('../classes/player')
const db = require('../database/db-connector')
const insert_player = db.insert_player
const select_player = db.select_player
const delete_player = db.delete_player
const update_player = db.update_player
const extend = require('lodash/extend')
appPlayers = express()

appPlayers.route('/').get((req, res) => {
    select_player(new Player(), req.query).then((rows) => {
        res.status(200)
        res.send(rows)
    }).catch((err) => {
        res.status(500)
        res.send(err.message)
    })
})

appPlayers.route('/:pid').get((req, res) => {
    let player = new Player({name: req.params.pid})
    select_player(player).then((rows) => {
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
    let {requirements, ...player} = new Player(req.body)
    if (Object.getOwnPropertyNames(req.body) !== Object.getOwnPropertyNames(new Player())) {
        res.status(400)
        res.send('To perform full update (PUT request) you must specify all of the resource fields')
        return
    }
    update_player(player, new Player({name: req.params.pid})).then((rows) => {
        res.status(200)
        res.send(rows)
    }).catch((err)=> {
        res.status(500)
        res.send(err.message)
    })
})

appPlayers.route('/:pid').patch((req, res) => {
    let update_properties = req.body
    let player = new Player({name: req.params.pid})
    select_player(player).then((rows) => {
        if (rows.length > 0) {
            let {last_date_modified, ...player} = rows[0]
            let player_update = {}
            Object.assign(player_update, player)
            extend(player_update, update_properties)
            update_player(player_update, player, true).then((rows) => {
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