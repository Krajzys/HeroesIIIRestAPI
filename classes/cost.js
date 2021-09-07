class Cost {
    gold
    wood
    ore
    mercury
    sulfur
    crystal
    gems
    constructor ({
        gold = 0,
        wood = 0,
        ore = 0,
        mercury = 0,
        sulfur = 0,
        crystal = 0,
        gems = 0
    }={}) {
        this.gold = gold
        this.wood = wood
        this.ore = ore
        this.mercury = mercury
        this.sulfur = sulfur
        this.crystal = crystal
        this.gems = gems
    }
}

module.exports = Cost