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
        requirements = [],
        last_date_modified = new Date()
    }={}) {
        this.name = name
        this.castle_name = castle_name
        this.level = level
        this.cost = cost
        this.requirements = requirements
        this.last_date_modified = last_date_modified
    }
}

module.exports = Building