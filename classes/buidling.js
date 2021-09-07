const Cost = require('./cost')

class Building {
    name
    castle_name
    unit_level
    cost
    constructor({
        name = '',
        castle_name = '',
        unit_level = 0,
        cost = new Cost()
    }) {
        this.name = name
        this.castle_name = castle_name
        this.unit_level = unit_level
        this.cost = new Cost(cost)
    }
}

module.exports = Building