express = require('express')
const Castle = require('../classes/castle')
const db = require('../database/db-connector')
const insert_castle = db.insert_castle
const select_castle = db.select_castle
const delete_castle = db.delete_castle
const update_castle = db.update_castle
const extend = require('lodash/extend')
appCastles = express()

// TODO: rozbudować żeby przechowywało dane o jednostkach i budynkach (plus można było updateować)

appCastles.route('/').get((req, res) => {
    select_castle(new Castle(), req.query).then((rows) => {
        res.status(200)
        res.send(rows)
    }).catch((err) => {
        res.status(500)
        res.send(err.message)
    })
})

appCastles.route('/:cid').get((req, res) => {
    let castle = new Castle({name: req.params.cid})
    select_castle(castle).then((rows) => {
        res.status(200)
        res.send(rows)
    }).catch((err) => {
        res.status(500)
        res.send(err.message)
    })
})

appCastles.route('/').post((req, res) => {
    let castle = new Castle(req.body)
    insert_castle([castle]).then((rows) => {
        res.status(200)
        res.send(castle)
    }).catch((err)=> {
        res.status(500)
        res.send(err.message)
    })
})

appCastles.route('/:cid').put((req, res) => {
    let {requirements, ...castle} = new Castle(req.body)
    if (Object.getOwnPropertyNames(req.body) !== Object.getOwnPropertyNames(new Castle())) {
        res.status(400)
        res.send('To perform full update (PUT request) you must specify all of the resource fields')
        return
    }
    update_castle(castle).then((rows) => {
        res.status(200)
        res.send(rows)
    }).catch((err)=> {
        res.status(500)
        res.send(err.message)
    })
})

appCastles.route('/:cid').patch((req, res) => {
    let update_properties = req.body
    let castle = new Castle({name: req.params.cid})
    select_castle(castle).then((rows) => {
        if (rows.length > 0) {
            let {last_date_modified, ...castle} = rows[0]
            let castle_update = {}
            Object.assign(castle_update, player)
            extend(castle_update, update_properties)
            update_castle(castle_update, castle, true).then((rows) => {
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

appCastles.route('/:cid').delete((req, res) => {
    let castle = new Castle({
        "name": req.params.cid
    })
    select_castle(castle).then((rows) => {
        delete_castle(castle).then((_rows) => {
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

module.exports = appCastles