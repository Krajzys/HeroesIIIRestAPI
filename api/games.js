express = require('express')
appGames = express()

appGames.route('/').get((req, res) => {
    res.send("Games data")
})

appGames.route('/').post((req, res) => {
    res.send(`POST Games data for Game`)
})

appGames.route('/:gid').put((req, res) => {
    res.send(`PUT Games data for Game ${req.params.gid}`)
})

appGames.route('/:gid').patch((req, res) => {
    res.send(`PATCH Games data for Game ${req.params.gid}`)
})

appGames.route('/:gid').delete((req, res) => {
    res.send(`DELETE Games data for Game ${req.params.gid}`)
})

module.exports = appGames