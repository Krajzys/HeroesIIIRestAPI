express = require('express')
const Token = require('../classes/token')
const db = require('../database/db-connector')
const insert = db.insert
const select = db.select
appTokens = express()

appTokens.route('/').post((req, res) => {
    let token = new Token({"token": createToken()})
    try {
        insert('token', [token])
        res.json(token)
    } catch (e) {
        console.error(e)
        res.json('There was an error')
    }
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