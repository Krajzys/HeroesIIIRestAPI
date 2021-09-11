const Cost = require('./cost')

class Building {
    name
    castle_name
    level
    cost
    requirements
    constructor({
        name = '',
        castle_name = '',
        level = 0,
        cost = new Cost(),
        requirements = []
    }={}) {
        this.name = name
        this.castle_name = castle_name
        this.level = level
        this.cost = new Cost(cost)
        this.requirements = requirements
    }
}

module.exports = Building