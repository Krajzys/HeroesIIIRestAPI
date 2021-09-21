class Player {
    name
    last_date_modified
    constructor({
        name = '',
        last_date_modified = new Date()
    } = {}) {
        this.name = name
        this.last_date_modified = last_date_modified
    }
}

module.exports = Player