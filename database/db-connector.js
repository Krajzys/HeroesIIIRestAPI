const mysql = require('mysql')

// const { table } = require('console')
// const { resolve } = require('path')

const Building = require('../classes/buidling')
const Castle = require('../classes/castle')
const Game = require('../classes/game')
const Map = require('../classes/map')
const Player = require('../classes/player')
const Token = require('../classes/token')
const Unit = require('../classes/unit')

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "secretpassword01",
    database: "datadb",
    port: 3420
})

con.connect(function(err) {
    if (err) throw err
    console.log('Connected!')
})

function insert_building(values) {
    let valuesList = ''
    var valuesAsList = []
    
    valuesList = '(name,castle_name,level,cost_id)'
    values.forEach(element => {
        const SET_COST = { toSqlString: function() { return `set_cost(${element.cost.gold},${element.cost.wood},${element.cost.ore},${element.cost.mercury},${element.cost.sulfur},${element.cost.crystal},${element.cost.gems})`; } };
        valuesAsList.push([element.name, element.castle_name, element.unit_level, SET_COST])
    })

    let queryString2 = `INSERT INTO requirement (building_name,castle_name,requirement_name) VALUES ?`;
    let valuesAsList2 = []
    
    values.forEach(element => {
        if (element.requirements.length !== 0) {
            element.requirements.forEach(requirement => {
                valuesAsList2.push([element.name, element.castle_name, requirement])
            })
        }
    })

    let queryString = `INSERT INTO building ${valuesList} VALUES ?`;

    return new Promise(function(resolve, reject) {
        con.query(queryString, [valuesAsList], function (err, result, fields) {
            if (err) {
                reject(err)
            } else {
                if (valuesAsList2.length !== 0) {
                    new Promise(function(_resolve, _reject) {
                        if (valuesAsList2.length !== 0) {
                            con.query(queryString2, [valuesAsList2], function (err, result, fields) {
                                    if (err) {
                                        reject (err)
                                    }
                                    resolve (result)
                                })
                            }
                        })
                } else {
                    resolve (result)
                }
            }
        })
    })
}

function insert_castle(values) {
    let valuesList = ''
    var valuesAsList = []

    valuesList = '(name)'
    values.forEach(element => {
        valuesAsList.push([element.name])
    })

    let queryString = `INSERT INTO castle ${valuesList} VALUES ?`;

    return new Promise(function(resolve, reject) {
            con.query(queryString, [valuesAsList], function (err, result, fields) {
            if (err) reject(err)
            resolve (result)
        })
    })
}

function insert_game(values) {
    let valuesList = ''
    var valuesAsList = []

    valuesList = '(id)'
    values.forEach(element => {
        valuesAsList.push([element.id])
    })
    
    let queryString = `INSERT INTO gane ${valuesList} VALUES ?`;

    return new Promise(function(resolve, reject) {
            con.query(queryString, [valuesAsList], function (err, result, fields) {
            if (err) reject(err)
            resolve (result)
        })
    })
}

function insert_map(values) {
    let valuesList = ''
    var valuesAsList = []

    valuesList = '(name,size)'
    values.forEach(element => {
        valuesAsList.push([element.name, element.size])
    })

    let queryString = `INSERT INTO map ${valuesList} VALUES ?`;

    return new Promise(function(resolve, reject) {
            con.query(queryString, [valuesAsList], function (err, result, fields) {
            if (err) reject(err)
            resolve (result)
        })
    })
}

function insert_player(values) {
    let valuesList = ''
    var valuesAsList = []
    
    valuesList = '(name)'
    values.forEach(element => {
        valuesAsList.push([element.name])
    })

    let queryString = `INSERT INTO player ${valuesList} VALUES ?`;

    return new Promise(function(resolve, reject) {
            con.query(queryString, [valuesAsList], function (err, result, fields) {
            if (err) reject(err)
            resolve (result)
        })
    })
}

function insert_token(values) {
    let valuesList = ''
    var valuesAsList = []

    valuesList = '(token)'
    values.forEach(element => {
        valuesAsList.push([element.token])
    })

    let queryString = `INSERT INTO token ${valuesList} VALUES ?`;

    return new Promise(function(resolve, reject) {
            con.query(queryString, [valuesAsList], function (err, result, fields) {
            if (err) reject(err)
            resolve (result)
        })
    })
}

function insert_unit(values) {
    let valuesList = ''
    var valuesAsList = []

    valuesList = '(name,castle_name,level,upgraded,cost_id)'
    values.forEach(element => {
        const SET_COST = { toSqlString: function() { return `set_cost(${element.cost.gold},${element.cost.wood},${element.cost.ore},${element.cost.mercury},${element.cost.sulfur},${element.cost.crystal},${element.cost.gems})`; } };
        valuesAsList.push([element.name, element.castle_name, element.level, element.upgraded, SET_COST])
    })

    let queryString = `INSERT INTO unit ${valuesList} VALUES ?`;

    return new Promise(function(resolve, reject) {
            con.query(queryString, [valuesAsList], function (err, result, fields) {
            if (err) reject(err)
            resolve (result)
        })
    })
}

function select_building(filters = new Building()) {
    let queryString = `SELECT b.name,b.castle_name,b.level,gold,wood,ore,mercury,sulfur,crystal,gems,GROUP_CONCAT(r.requirement_name) AS requirements FROM building b JOIN cost ON (cost_id = id) JOIN requirement r ON (name = building_name AND b.castle_name = r.castle_name) GROUP BY requirement_name`
    return new Promise (function(resolve, reject) {
            con.query(queryString, function (err, rows, fields) {
            if (err) reject(err)
            resolve(rows)
        })
    })
}

function select_castle(filters = new Castle()) {
    let queryString = `SELECT * FROM castle`
    return new Promise (function(resolve, reject) {
            con.query(queryString, function (err, rows, fields) {
            if (err) reject(err)
            resolve(rows)
        })
    })
}

function select_game(filters = new Game()) {
    let queryString = `SELECT * FROM game`
    return new Promise (function(resolve, reject) {
            con.query(queryString, function (err, rows, fields) {
            if (err) reject(err)
            resolve(rows)
        })
    })
}

function select_map(filters = new Map()) {
    let queryString = `SELECT * FROM map`
    return new Promise (function(resolve, reject) {
            con.query(queryString, function (err, rows, fields) {
            if (err) reject(err)
            resolve(rows)
        })
    })
}

function select_player(filters = new Player()) {
    let queryString = `SELECT * FROM player`
    return new Promise (function(resolve, reject) {
            con.query(queryString, function (err, rows, fields) {
            if (err) reject(err)
            resolve(rows)
        })
    })
}

function select_token(filters = new Token()) {
    let queryString = `SELECT * FROM token`
    return new Promise (function(resolve, reject) {
            con.query(queryString, function (err, rows, fields) {
            if (err) reject(err)
            resolve(rows)
        })
    })
}

function select_unit(filters = new Unit()) {
    let queryString = `SELECT * FROM unit JOIN cost ON (cost_id = id)`
    return new Promise (function(resolve, reject) {
        con.query(queryString, function (err, rows, fields) {
            if (err) reject(err)
            resolve(rows)
        })
    })
}

function delete_building(buidling = new Building()) {
    let queryString = `DELETE FROM building WHERE name = ? AND castle_name = ?`
    return new Promise(function(resolve, reject) {
        con.query(queryString, [buidling.name, buidling.castle_name], function(err, rows, fields) {
            if (err) reject(err)
            resolve(rows)
        })
    })
}

function delete_castle(castle = new Castle()) {
    let queryString = `DELETE FROM castle WHERE name = ?`
    return new Promise(function(resolve, reject) {
        con.query(queryString, [castle.name], function(err, rows, fields) {
            if (err) reject(err)
            resolve(rows)
        })
    })
}

function delete_game(game = new Game()) {
    let queryString = `DELETE FROM game WHERE id = ?`
    return new Promise(function(resolve, reject) {
        con.query(queryString, [game.id], function(err, rows, fields) {
            if (err) reject(err)
            resolve(rows)
        })
    })
}

function delete_map(map = new Map()) {
    let queryString = `DELETE FROM map WHERE name = ?`
    return new Promise(function(resolve, reject) {
        con.query(queryString, [map.name], function(err, rows, fields) {
            if (err) reject(err)
            resolve(rows)
        })
    })
}

function delete_player(player = new player()) {
    let queryString = `DELETE FROM player WHERE name = ?`
    return new Promise(function(resolve, reject) {
        con.query(queryString, [player.name], function(err, rows, fields) {
            if (err) reject(err)
            resolve(rows)
        })
    })
}

function delete_token(token = new Token()) {
    let queryString = `DELETE FROM token WHERE token = ?`
    return new Promise(function(resolve, reject) {
        con.query(queryString, [token.token], function(err, rows, fields) {
            if (err) reject(err)
            resolve(rows)
        })
    })
}

function delete_unit(unit = new Unit()) {
    let queryString = `DELETE FROM unit WHERE name = ?`
    return new Promise(function(resolve, reject) {
        con.query(queryString, [unit.name], function(err, rows, fields) {
            if (err) reject(err)
            resolve(rows)
        })
    })
}

// TODO: Add PUT and PATCH(odata_etag) methods

exports.con = con

exports.insert_building = insert_building
exports.insert_castle = insert_castle
exports.insert_game = insert_game
exports.insert_map = insert_map
exports.insert_player = insert_player
exports.insert_token = insert_token
exports.insert_unit = insert_unit

exports.select_building = select_building
exports.select_castle = select_castle
exports.select_game = select_game
exports.select_map = select_map
exports.select_player = select_player
exports.select_token = select_token
exports.select_unit = select_unit

exports.delete_building = delete_building
exports.delete_castle = delete_castle
exports.delete_game = delete_game
exports.delete_map = delete_map
exports.delete_player = delete_player
exports.delete_token = delete_token
exports.delete_unit = delete_unit
