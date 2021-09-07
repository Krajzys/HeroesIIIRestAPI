const Cost = require('./cost')

class Unit {
    name
    castle_name
    level
    upgraded
    cost
    constructor({
        name = '',
        castle_name = '',
        level = 0,
        upgraded = false,
        cost = new Cost()
    }) {
        this.name = name
        this.castle_name = castle_name
        this.level = level
        this.upgraded = upgraded
        this.cost = new Cost(cost)
    }
}

module.exports = Unit