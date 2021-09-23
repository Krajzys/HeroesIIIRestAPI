express = require('express')
const Game = require('../classes/game')
const Token = require('../classes/token')
const db = require('../database/db-connector')
const insert_game = db.insert_game
const select_game = db.select_game
const delete_game = db.delete_game
const update_game = db.update_game
const delete_token = db.delete_token
const extend = require('lodash/extend')
appGames = express()

appGames.route('/').get((req, res) => {
    select_game(new Game(), req.query).then((rows) => {
        res.status(200)
        res.send(rows)
    }).catch((err) => {
        res.status(500)
        res.send(err.message)
    })
})

appGames.route('/:gid').get((req, res) => {
    let game = new Game({id: req.params.gid})
    select_game(game).then((rows) => {
        res.status(200)
        res.send(rows)
    }).catch((err) => {
        res.status(500)
        res.send(err.message)
    })
})

appGames.route('/').post((req, res) => {
    let token = new Token({token: req.body.token})
    let values = new Game({name: req.body.name})
    delete_token(token).then((rows) => {
        if (rows.affectedRows === 0) {
            res.status(404)
            res.send('Entered token is invalid')
            return
        }
        insert_game([values]).then((rows) => {
            res.status(200)
            let game = new Game({id: rows.insertId, name: values.name})
            res.json(game)
        }).catch((err)=> {
            res.status(500)
            res.send(err.message)
        })
    })
})

appGames.route('/:gid').put((req, res) => {
    let {requirements, ...game} = new Game(req.body)
    let old_game = new Game({id: req.params.gid})
    update_game(game, old_game).then((rows) => {
        res.status(200)
        res.send(rows)
    }).catch((err)=> {
        res.status(500)
        res.send(err.message)
    })
})

appGames.route('/:gid').patch((req, res) => {
    let update_properties = req.body
    let game = new Game({id: req.params.gid})
    select_game(game).then((rows) => {
        if (rows.length > 0) {
            let {last_date_modified, ...game} = rows[0]
            let game_update = {}
            Object.assign(game_update, game)
            extend(game_update, update_properties)
            update_game(game_update, game, true).then((rows) => {
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

appGames.route('/:gid').delete((req, res) => {
    let game = new Game({
        "id": req.params.gid
    })
    select_game(game).then((rows) => {
        delete_game(game).then((_rows) => {
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

module.exports = appGames