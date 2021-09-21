class Game {
    id
    name
    last_date_modified
    constructor({
        id = '',
        name = '',
        last_date_modified = new Date()
    } = {}) {
        this.id = id
        this.name = name
        this.last_date_modified = last_date_modified
    }
}

module.exports = Game