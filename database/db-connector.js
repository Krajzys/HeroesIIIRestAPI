const mysql = require('mysql')

const Building = require('../classes/building')
const Castle = require('../classes/castle')
const Cost = require('../classes/cost')
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
    port: 3306
})

con.connect(function(err) {
    if (err) throw err
    console.log('Connected!')
})

function to_maria_db_timestamp(date = new Date()) {
    return date.toLocaleString().replace(/\./g, '-').replace(/, /g, 'T')
}

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

    valuesList = '(name)'
    values.forEach(element => {
        valuesAsList.push([element.name])
    })
    
    let queryString = `INSERT INTO game ${valuesList} VALUES ?`;

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

function select_building(filters = new Building(), query = {}) {
    let queryString = `SELECT b.name,b.castle_name,b.level,gold,wood,ore,mercury,sulfur,crystal,gems,GROUP_CONCAT(r.requirement_name) AS requirements,last_date_modified FROM building b LEFT JOIN cost ON (cost_id = id) LEFT JOIN requirement r ON (name = building_name AND b.castle_name = r.castle_name)`
    if (filters.name !== '' && filters.castle_name !== '') {
        queryString += ` WHERE b.name = '${filters.name}' AND b.castle_name = '${filters.castle_name}'`
    }
    queryString += ` GROUP BY name`
    if (parseInt(query.limit) > 0) {
        queryString += ` LIMIT ${query.limit}`
    }
    if (parseInt(query.offset) > 0) {
        queryString += ` OFFSET ${query.offset}`
    }
    return new Promise (function(resolve, reject) {
            con.query(queryString, function (err, rows, fields) {
            if (err) reject(err)
            let new_rows = []
            rows.forEach((element) => {
                let new_building = new Building({
                    name: element.name,
                    castle_name: element.castle_name,
                    level: element.level,
                    requirements: element.requirements?.split(','),
                    cost: new Cost({
                        gold: element.gold,
                        wood: element.wood,
                        ore: element.ore,
                        mercury: element.mercury,
                        sulfur: element.sulfur,
                        crystal: element.crystal,
                        gems: element.gems
                    }),
                    last_date_modified: to_maria_db_timestamp(element.last_date_modified)
                })
                new_rows.push(new_building)
            })
            resolve(new_rows)
        })
    })
}

function select_castle(filters = new Castle(), query = {}) {
    let queryString = `SELECT * FROM castle`
    if (filters.name !== '') {
        queryString += ` WHERE name = '${filters.name}'`
    }
    if (parseInt(query.limit) > 0) {
        queryString += ` LIMIT ${query.limit}`
    }
    if (parseInt(query.offset) > 0) {
        queryString += ` OFFSET ${query.offset}`
    }
    return new Promise (function(resolve, reject) {
            con.query(queryString, function (err, rows, fields) {
            if (err) reject(err)
            let new_rows = []
            rows.forEach((element) => {
                let new_castle = new Castle({
                    name: element.name,
                    last_date_modified: to_maria_db_timestamp(element.last_date_modified)
                })
                new_rows.push(new_castle)
            })
            resolve(new_rows)
        })
    })
}

function select_game(filters = new Game(), query = {}) {
    let queryString = `SELECT * FROM game`
    if (filters.id !== '') {
        queryString += ` WHERE id = '${filters.id}'`
    }
    if (parseInt(query.limit) > 0) {
        queryString += ` LIMIT ${query.limit}`
    }
    if (parseInt(query.offset) > 0) {
        queryString += ` OFFSET ${query.offset}`
    }
    return new Promise (function(resolve, reject) {
            con.query(queryString, function (err, rows, fields) {
            if (err) reject(err)
            let new_rows = []
            rows.forEach((element) => {
                let new_game = new Game({
                    id: element.id,
                    last_date_modified: to_maria_db_timestamp(element.last_date_modified),
                    name: element.name
                })
                new_rows.push(new_game)
            })
            resolve(new_rows)
        })
    })
}

function select_map(filters = new Map(), query = {}) {
    let queryString = `SELECT * FROM map`
    if (filters.name !== '') {
        queryString += ` WHERE name = '${filters.name}'`
    }
    if (parseInt(query.limit) > 0) {
        queryString += ` LIMIT ${query.limit}`
    }
    if (parseInt(query.offset) > 0) {
        queryString += ` OFFSET ${query.offset}`
    }
    return new Promise (function(resolve, reject) {
            con.query(queryString, function (err, rows, fields) {
            if (err) reject(err)
            let new_rows = []
            rows.forEach((element) => {
                let new_map = new Map({
                    name: element.name,
                    size: element.size,
                    last_date_modified: to_maria_db_timestamp(element.last_date_modified)
                })
                new_rows.push(new_map)
            })
            resolve(new_rows)
        })
    })
}

function select_player(filters = new Player(), query = {}) {
    let queryString = `SELECT * FROM player`
    if (filters.name !== '') {
        queryString += ` WHERE name = '${filters.name}'`
    }
    if (parseInt(query.limit) > 0) {
        queryString += ` LIMIT ${query.limit}`
    }
    if (parseInt(query.offset) > 0) {
        queryString += ` OFFSET ${query.offset}`
    }
    return new Promise (function(resolve, reject) {
            con.query(queryString, function (err, rows, fields) {
            if (err) reject(err)
            let new_rows = []
            rows.forEach((element) => {
                let new_player = new Player({
                    name: element.name,
                    last_date_modified: to_maria_db_timestamp(element.last_date_modified)
                })
                new_rows.push(new_player)
            })
            resolve(new_rows)
        })
    })
}

function select_token(filters = new Token()) {
    let queryString = `SELECT * FROM token WHERE token = '${filters.token}'`
    return new Promise (function(resolve, reject) {
            con.query(queryString, function (err, rows, fields) {
            if (err) reject(err)
            resolve(rows)
        })
    })
}

function select_unit(filters = new Unit(), query = {}) {
    let queryString = `SELECT * FROM unit JOIN cost ON (cost_id = id)`
    if (filters.name !== '') {
        queryString += ` WHERE name = '${filters.name}'`
        if (query.castle) {
            queryString += ` AND castle_name = '${query.castle}'`
        }
    }
    else if (query.castle) {
        queryString += ` WHERE castle_name = '${query.castle}'`
    }
    
    if (parseInt(query.limit) > 0) {
        queryString += ` LIMIT ${query.limit}`
    }
    if (parseInt(query.offset) > 0) {
        queryString += ` OFFSET ${query.offset}`
    }
    return new Promise (function(resolve, reject) {
        con.query(queryString, function (err, rows, fields) {
            if (err) reject(err)
            let new_rows = []
            rows.forEach((element) => {
                let new_unit = new Unit({
                    name: element.name,
                    castle_name: element.castle_name,
                    level: element.level,
                    upgraded: element.upgraded,
                    cost: new Cost({
                        gold: element.gold,
                        wood: element.wood,
                        ore: element.ore,
                        mercury: element.mercury,
                        sulfur: element.sulfur,
                        crystal: element.crystal,
                        gems: element.gems
                    }),
                    last_date_modified: to_maria_db_timestamp(element.last_date_modified)
                })
                new_rows.push(new_unit)
            })
            resolve(new_rows)
        })
    })
}

function delete_building(building = new Building()) {
    let queryString = `DELETE FROM building WHERE name = ? AND castle_name = ?`
    return new Promise(function(resolve, reject) {
        con.query(queryString, [building.name, building.castle_name], function(err, rows, fields) {
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

function delete_unit(unit = new Unit()) {
    let queryString = `DELETE FROM unit WHERE name = ?`
    return new Promise(function(resolve, reject) {
        con.query(queryString, [unit.name], function(err, rows, fields) {
            if (err) reject(err)
            resolve(rows)
        })
    })
}

function delete_units(units = [], castle_name = '') {
    let queryString = `DELETE FROM unit WHERE name IN (?) AND castle_name = ?`
    return new Promise(function(resolve, reject) {
        con.query(queryString, [units, castle_name], function(err, rows, fields) {
            if (err) reject(err)
            resolve(rows)
        })
    })
}

function update_building(building = new Building(), old_building = new Building(), with_date = false) {
    const SET_COST = { toSqlString: function() { return `set_cost(${building.cost.gold},${building.cost.wood},${building.cost.ore},${building.cost.mercury},${building.cost.sulfur},${building.cost.crystal},${building.cost.gems})`; } };
    let queryString = `UPDATE building SET name = ?, castle_name = ?, level = ?, cost_id = ? WHERE name = '${old_building.name}' AND castle_name = '${old_building.castle_name}'`
    let valuesAsList = [building.name, building.castle_name, building.level, SET_COST]
    const SET_TIMESTAMP = { toSqlString: function() { return `STR_TO_DATE('${building.last_date_modified}', '%d-%m-%YT%H:%i:%s')`} }
    if (with_date) {
        queryString += ` AND last_date_modified = ?`
        valuesAsList.push(SET_TIMESTAMP)
    }
    return new Promise(function(resolve, reject) {
        con.query(queryString, valuesAsList, function(err, rows, fields) {
            if (err) reject(err)
            resolve(rows)
        })
    })
}

function update_castle(castle = new Castle(), old_castle = new Castle(), with_date = false) {
    let queryString = `UPDATE castle SET name = ? WHERE name = '${old_castle.name}'`
    if (with_date) {
        queryString += ` AND last_date_modified = STR_TO_DATE('${castle.last_date_modified}', '%d-%m-%YT%H:%i:%s')`
    }
    return new Promise(function(resolve, reject) {
        con.query(queryString, [castle.name], function(err, rows, fields) {
            if (err) reject(err)
            resolve(rows)
        })
    })
}

function update_game(game = new Game(), old_game = new Game(), with_date = false) {
    let queryString = `UPDATE game SET id = ?, name = ? WHERE id = '${old_game.id}'`
    if (with_date) {
        queryString += ` AND last_date_modified = STR_TO_DATE('${game.last_date_modified}', '%d-%m-%YT%H:%i:%s')`
    }
    return new Promise(function(resolve, reject) {
        con.query(queryString, [game.id, game.name], function(err, rows, fields) {
            if (err) reject(err)
            resolve(rows)
        })
    })
}

function update_map(map = new Map(), old_map = new Map(), with_date = false) {
    let queryString = `UPDATE map SET size = ?, name = ? WHERE name = '${old_map.name}'`
    if (with_date) {
        queryString += ` AND last_date_modified = STR_TO_DATE('${map.last_date_modified}', '%d-%m-%YT%H:%i:%s')`
    }
    return new Promise(function(resolve, reject) {
        con.query(queryString, [map.size, map.name], function(err, rows, fields) {
            if (err) reject(err)
            resolve(rows)
        })
    })
}

function update_player(player = new Player(), old_player = new Player(), with_date = false) {
    let queryString = `UPDATE player SET name = ? WHERE name = '${old_player.name}'`
    if (with_date) {
        queryString += ` AND last_date_modified = STR_TO_DATE('${player.last_date_modified}', '%d-%m-%YT%H:%i:%s')`
    }
    return new Promise(function(resolve, reject) {
        con.query(queryString, [player.name], function(err, rows, fields) {
            if (err) reject(err)
            resolve(rows)
        })
    })
}

function update_unit(unit = new Unit(), old_unit = new Unit(), with_date = false) {
    const SET_COST = { toSqlString: function() { return `set_cost(${unit.cost.gold},${unit.cost.wood},${unit.cost.ore},${unit.cost.mercury},${unit.cost.sulfur},${unit.cost.crystal},${unit.cost.gems})`; } };
    let queryString = `UPDATE unit SET name = ?, castle_name = ?, level = ?, upgraded = ?, cost_id = ? WHERE name = '${old_unit.name}'`
    if (with_date) {
        queryString += ` AND last_date_modified = STR_TO_DATE('${unit.last_date_modified}', '%d-%m-%YT%H:%i:%s')`
    }
    return new Promise(function(resolve, reject) {
        con.query(queryString, [unit.name, unit.castle_name, unit.level, unit.upgraded, SET_COST], function(err, rows, fields) {
            if (err) reject(err)
            resolve(rows)
        })
    })
}

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
exports.delete_units = delete_units

exports.update_building = update_building
exports.update_castle = update_castle
exports.update_game = update_game
exports.update_map = update_map
exports.update_player = update_player
exports.update_unit = update_unit