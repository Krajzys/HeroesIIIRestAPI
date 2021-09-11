class Map {
    name
    size
    constructor({
        name = '',
        size = ''
    } = {}) {
        this.name = name
        this.size = size
    }
}

module.exports = Map