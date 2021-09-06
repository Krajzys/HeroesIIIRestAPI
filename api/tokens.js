express = require('express')
appTokens = express()

appTokens.route('/').post((req, res) => {
    res.send("Here's your unique token! asdzxcasdz")
})

module.exports = appTokens