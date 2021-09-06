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

module.exports = con