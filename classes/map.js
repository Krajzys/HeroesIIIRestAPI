class Map {
    name
    size
    last_date_modified
    constructor({
        name = '',
        size = '',
        last_date_modified = new Date()
    } = {}) {
        this.name = name
        this.size = size
        this.last_date_modified = last_date_modified
    }
}

module.exports = Map