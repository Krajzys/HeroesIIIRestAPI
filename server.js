const port = 3000;

const express = require('express')
const cors = require('cors')
const castlesApp = require('./api/castles')
const buildingsApp = require('./api/buildings')
const gamesApp = require('./api/games')
const mapsApp = require('./api/maps')
const playersApp = require('./api/players')
const tokensApp = require('./api/tokens')
const unitsApp = require('./api/units')

const app = express()
app.use(cors())

app.use('/castles', castlesApp)
app.use('/buildings', buildingsApp)
app.use('/games', gamesApp)
app.use('/maps', mapsApp)
app.use('/players', playersApp)
app.use('/tokens', tokensApp)
app.use('/units', unitsApp)

app.get('/', (req, res) => {
    return res.send("Received a GET HTTP method")
})

app.post('/', (req, res) => {
    return res.send("Received a POST HTTP method")
})

app.put('/', (req, res) => {
    return res.send("Received a PUT HTTP method")
})

app.patch('/', (req, res) => {
    return res.send("Received a PATCH HTTP method")
})

app.delete('/', (req, res) => {
    return res.send("Received a DELETE HTTP method")
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`)
})