express = require('express')
const Castle = require('../classes/castle')
const db = require('../database/db-connector')
const insert_castle = db.insert_castle
const select_castle = db.select_castle
const delete_castle = db.delete_castle
const update_castle = db.update_castle
const extend = require('lodash/extend')
const Unit = require('../classes/unit')
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
    let old_castle = new Castle({name: req.params.cid})
    update_castle(castle, old_castle).then((rows) => {
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

appCastles.route('/:cid/units').get((req, res) => {
    let castle = new Castle({name: req.params.cid})
    select_castle(castle).then((rows) => {
        let unit = new Unit()
        req.query.castle = rows[0].name
        db.select_unit(unit, req.query).then((rows) => {
            res.status(200)
            res.send(rows)
        })
    }).catch((err) => {
        res.status(500)
        res.send(err.message)
    })
})

appCastles.route('/:cid/units').post((req, res) => {
    let units = req.body.units
    let ok_count = 0
    db.con.beginTransaction()
    for (let i = 0; i < units.length; i++) {
        db.insert_unit([units[i]]).then((rows) => {
            ok_count += 1
            if (ok_count === units.length) {
                db.con.commit()
                res.status(200)
                res.json(units)
            }
        }).catch((err) => {
            db.con.rollback()
            res.status(500)
            res.send(err.message)
        })
    }
})

appCastles.route('/:cid/units').put((req, res) => {
    let units = req.body.units
    let ok_count = 0
    db.con.beginTransaction()
    db.select_unit(new Unit(), {castle: req.params.cid}).then((rows) => {
        let unit_names = []
        rows.forEach((element) => {
            unit_names.push(element.name)
        })
        db.delete_units(unit_names, req.params.cid).then((_rows) => {
            for (let i = 0; i < units.length; i++) {
                db.insert_unit([units[i]]).then((__rows) => {
                    ok_count += 1
                    if (ok_count === units.length) {
                        db.con.commit()
                        res.status(200)
                        res.json(units)
                    }
                }).catch((err) => {
                    db.con.rollback()
                    res.status(500)
                    res.send(err.message)
                })
            }
        })
    }).catch((err) => {
        db.con.rollback()
        res.status(500)
        res.send(err.message)
    })
})

appCastles.route('/:cid/units').delete((req, res) => {
    let names = req.body.names
    db.delete_units(names, req.params.cid).then((rows) => {
        res.status(200)
        res.send(rows)
    }).catch((err) => {
        res.status(500)
        res.send(err.message)
    })
})

module.exports = appCastles