const { table } = require('console')
const mysql = require('mysql')
const Building = require('../classes/buidling')

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

function insert(tablename, values, commit=false) {
    let valuesList = ''
    var valuesAsList = []
    switch (tablename) {
        case 'building':
            valuesList = '(name,castle_name,unit_level,cost_id)'
            values.forEach(element => {
                const SET_COST = { toSqlString: function() { return `set_cost(${element.cost.gold},${element.cost.wood},${element.cost.ore},${element.cost.mercury},${element.cost.sulfur},${element.cost.crystal},${element.cost.gems})`; } };
                valuesAsList.push([element.name, element.castle_name, element.unit_level, SET_COST])
            })
            break
        case 'castle':
            valuesList = '(name)'
            values.forEach(element => {
                valuesAsList.push([element.name])
            })
            break
        case 'game':
            valuesList = '(id)'
            values.forEach(element => {
                valuesAsList.push([element.id])
            })
            break
        case 'map':
            valuesList = '(name,size)'
            values.forEach(element => {
                valuesAsList.push([element.name, element.size])
            })
            break
        case 'player':
            valuesList = '(name)'
            values.forEach(element => {
                valuesAsList.push([element.name])
            })
            break
        case 'token':
            valuesList = '(token)'
            values.forEach(element => {
                valuesAsList.push([element.token])
            })
            break
        case 'unit':
            valuesList = '(name,castle_name,level,upgraded,cost_id)'
            values.forEach(element => {
                const SET_COST = { toSqlString: function() { return `set_cost(${element.cost.gold},${element.cost.wood},${element.cost.ore},${element.cost.mercury},${element.cost.sulfur},${element.cost.crystal},${element.cost.gems})`; } };
                valuesAsList.push([element.name, element.castle_name, element.level, element.upgraded, SET_COST])
            })
            break
        default:
            throw new Error('Unknown table')
    }

    let x = con.query(`INSERT INTO ${tablename}${valuesList} VALUES ?`, [valuesAsList], function (err, result) {
        if (err) throw err
        console.log('Result: ' + result)
    })
    if (commit) con.commit()
}

function select(tablename, classObject) {
    let filters = ''
    let biggerResult = {}
    switch (tablename) {
        case 'building':
            let buidling = new Building(classObject)
            // valuesList = '(name,castle_name,unit_level,cost_id)'
            // values.forEach(element => {
            //     const SET_COST = { toSqlString: function() { return `set_cost(${element.cost.gold},${element.cost.wood},${element.cost.ore},${element.cost.mercury},${element.cost.sulfur},${element.cost.crystal},${element.cost.gems})`; } };
            //     valuesAsList.push([element.name, element.castle_name, element.unit_level, SET_COST])
            // })
            con.query(`SELECT * FROM ${tablename} JOIN cost ON (cost_id = id)`, function (err, result) {
                if (err) throw err
                console.log('Result: ' + result)
            })
            break
        case 'castle':
            valuesList = '(name)'
            values.forEach(element => {
                valuesAsList.push([element.name])
            })
            break
        case 'game':
            valuesList = '(id)'
            values.forEach(element => {
                valuesAsList.push([element.id])
            })
            break
        case 'map':
            valuesList = '(name,size)'
            values.forEach(element => {
                valuesAsList.push([element.name, element.size])
            })
            break
        case 'player':
            valuesList = '(name)'
            values.forEach(element => {
                valuesAsList.push([element.name])
            })
            break
        case 'token':
            valuesList = '(token)'
            values.forEach(element => {
                valuesAsList.push([element.token])
            })
            break
        case 'unit':
            // valuesList = '(name,castle_name,level,upgraded,cost_id)'
            // values.forEach(element => {
            //     const SET_COST = { toSqlString: function() { return `set_cost(${element.cost.gold},${element.cost.wood},${element.cost.ore},${element.cost.mercury},${element.cost.sulfur},${element.cost.crystal},${element.cost.gems})`; } };
            //     valuesAsList.push([element.name, element.castle_name, element.level, element.upgraded, SET_COST])
            // })
            con.query(`SELECT * FROM ${tablename} JOIN cost ON (cost_id = id)`, function (err, result) {
                if (err) throw err
                console.log('Result: ' + result)
                biggerResult = result
            })
            break
        default:
            throw new Error('Unknown table')
    }
    console.log('end')
}

exports.con = con
exports.insert = insert
exports.select = select