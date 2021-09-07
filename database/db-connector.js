const { table } = require('console')
const mysql = require('mysql')

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
            break
        case 'game':
            valuesList = '(id)'
            break
        case 'map':
            valuesList = '(name,size)'
            break
        case 'player':
            valuesList = '(name)'
            break
        case 'token':
            valuesList = '(token)'
            break
        case 'unit':
            valuesList = '(name,castle_name,level,upgraded,cost_id)'
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

exports.con = con
exports.insert = insert