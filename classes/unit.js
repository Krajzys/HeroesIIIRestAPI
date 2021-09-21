const Cost = require('./cost')

class Unit {
    name
    castle_name
    level
    upgraded
    cost
    last_date_modified
    constructor({
        name = '',
        castle_name = '',
        level = 0,
        upgraded = false,
        cost = new Cost(),
        last_date_modified = new Date()
    }={}) {
        this.name = name
        this.castle_name = castle_name
        this.level = level
        this.upgraded = upgraded
        this.cost = new Cost(cost)
        this.last_date_modified = last_date_modified
    }
}

module.exports = Unit