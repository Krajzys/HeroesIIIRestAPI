express = require('express')
const Token = require('../classes/token')
const db = require('../database/db-connector')
const insert_token = db.insert_token
appTokens = express()

appTokens.route('/').post((req, res) => {
    let token = new Token({"token": createToken()})
    insert_token([token]).then((rows) => {
        res.status(200)
        res.send(token)
    }).catch((err)=> {
        res.status(500)
        res.send(err.message)
    })
})

function createToken() {
    let result           = ''
    let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let charactersLength = characters.length
    const length = 20
    for ( let i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength))
   }
   return result
}

module.exports = appTokens