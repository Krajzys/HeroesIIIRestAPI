DROP TABLE IF EXISTS token;
DROP TABLE IF EXISTS game_player;
DROP TABLE IF EXISTS map;
DROP TABLE IF EXISTS unit;
DROP TABLE IF EXISTS requirement;
DROP TABLE IF EXISTS building;
DROP TABLE IF EXISTS game;
DROP TABLE IF EXISTS player;
DROP TABLE IF EXISTS cost;
DROP TABLE IF EXISTS castle;

CREATE OR REPLACE TABLE castle(
    name VARCHAR(30) CHARACTER SET utf8 NOT NULL PRIMARY KEY,
    last_date_modified TIMESTAMP
);
CREATE OR REPLACE TABLE cost(
    id INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT,
    gold INTEGER,
    wood INTEGER,
    ore INTEGER,
    mercury INTEGER,
    sulfur INTEGER,
    crystal INTEGER,
    gems INTEGER
);
CREATE OR REPLACE TABLE unit(
    name VARCHAR(30) CHARACTER SET utf8 NOT NULL PRIMARY KEY,
    castle_name VARCHAR(30) CHARACTER SET utf8,
    level INTEGER,
    upgraded BOOLEAN,
    cost_id INTEGER,
    last_date_modified TIMESTAMP,
    CONSTRAINT unit_fk_castle FOREIGN KEY (castle_name) REFERENCES castle (name) ON UPDATE CASCADE,
    CONSTRAINT unit_fk_cost FOREIGN KEY (cost_id) REFERENCES cost (id)
);
CREATE OR REPLACE TABLE map(
    name VARCHAR(30) CHARACTER SET utf8 NOT NULL PRIMARY KEY,
    size VARCHAR(5),
    last_date_modified TIMESTAMP
);
CREATE OR REPLACE TABLE building(
    name VARCHAR(30) CHARACTER SET utf8 NOT NULL,
    castle_name VARCHAR(30) CHARACTER SET utf8 NOT NULL,
    level INTEGER,
    cost_id INTEGER,
    last_date_modified TIMESTAMP,
    PRIMARY KEY (name, castle_name),
    CONSTRAINT building_fk_castle FOREIGN KEY (castle_name) REFERENCES castle (name) ON UPDATE CASCADE,
    CONSTRAINT building_fk_cost FOREIGN KEY (cost_id) REFERENCES cost (id)
);
CREATE OR REPLACE TABLE requirement(
    building_name VARCHAR(30) CHARACTER SET utf8 NOT NULL,
    castle_name VARCHAR(30) CHARACTER SET utf8 NOT NULL,
    requirement_name VARCHAR(30) CHARACTER SET utf8 NOT NULL,
    PRIMARY KEY (building_name, castle_name, requirement_name),
    CONSTRAINT requirement_fk_building FOREIGN KEY (building_name) REFERENCES building (name) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT requirement_fk_building_2 FOREIGN KEY (requirement_name) REFERENCES building (name) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT requirement_fk_castle FOREIGN KEY (castle_name) REFERENCES castle (name) ON DELETE CASCADE ON UPDATE CASCADE
);
-- TODO: doda?? castle_name do graczaa
-- TODO: doda?? tabelk?? pomocnicz?? player_unit (wi?????? gracza z jego jednostakami)
-- TODO: doda?? tabelk?? pomocnicz?? player_building (wi?????? gracza z jego budynkami)
CREATE OR REPLACE TABLE player(
    name VARCHAR(30) CHARACTER SET utf8 NOT NULL PRIMARY KEY,
    last_date_modified TIMESTAMP
);
CREATE OR REPLACE TABLE token(
    token CHAR(20) NOT NULL PRIMARY KEY
);
-- TODO: doda?? map?? do gry
CREATE OR REPLACE TABLE game(
    id INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(30),
    last_date_modified TIMESTAMP
);
CREATE OR REPLACE TABLE game_player(
    game_id INTEGER NOT NULL,
    player_name VARCHAR(30) CHARACTER SET utf8 NOT NULL,
    PRIMARY KEY (game_id, player_name),
    CONSTRAINT game_player_game_fk FOREIGN KEY (game_id) REFERENCES game (id),
    CONSTRAINT game_player_player_fk FOREIGN KEY (player_name) REFERENCES player (name) ON UPDATE CASCADE
);

DELIMITER //

CREATE OR REPLACE FUNCTION set_cost(goldIn INTEGER,
    woodIn INTEGER,
    oreIn INTEGER,
    mercuryIn INTEGER,
    sulfurIn INTEGER,
    crystalIn INTEGER,
    gemsIn INTEGER) RETURNS INTEGER
BEGIN
    SET @id = (SELECT MAX(id) FROM cost WHERE
        IFNULL(gold,0) = goldIn AND 
        IFNULL(wood,0) = woodIn AND
        IFNULL(ore,0) = oreIn AND
        IFNULL(mercury,0) = mercuryIn AND
        IFNULL(sulfur,0) = sulfurIn AND
        IFNULL(crystal,0) = crystalIn AND
        IFNULL(gems,0) = gemsIn);

    IF @id IS NOT NULL THEN
        RETURN @id;
    ELSE
        INSERT INTO cost(gold,wood,ore,mercury,sulfur,crystal,gems) VALUES
        (NULLIF(goldIn,0),NULLIF(woodIn,0),NULLIF(oreIn,0),NULLIF(mercuryIN,0),
         NULLIF(sulfurIn,0),NULLIF(crystalIn,0),NULLIF(gemsIn,0));
        RETURN LAST_INSERT_ID();
    END IF;
END

//

DELIMITER ;

INSERT INTO castle(name) VALUES ('Zamek'),('Inferno'),('Forteca'),('Twierdza'),('Bastion'),('Wrota ??ywio????w'),('Nekropolia'),('Loch'),('Cytadela');

-- Insert data for castle Zamek
INSERT INTO unit(castle_name, name, level, upgraded, cost_id) VALUES
 ('Zamek', 'Pikinier', '1', false, set_cost(60,0,0,0,0,0,0)),('Zamek', 'Halabardnik', '1', true, set_cost(75,0,0,0,0,0,0)),
 ('Zamek', '??ucznik', '2', false, set_cost(100,0,0,0,0,0,0)),('Zamek', 'Kusznik', '2', true, set_cost(150,0,0,0,0,0,0)),
 ('Zamek', 'Gryf', '3', false, set_cost(200,0,0,0,0,0,0)),('Zamek', 'Gryf kr??lewski', '3', true, set_cost(240,0,0,0,0,0,0)),
 ('Zamek', 'Zbrojny', '4', false, set_cost(300,0,0,0,0,0,0)),('Zamek', 'Krzy??owiec', '4', true, set_cost(400,0,0,0,0,0,0)),
 ('Zamek', 'Mnich', '5', false, set_cost(400,0,0,0,0,0,0)),('Zamek', 'Kap??an', '5', true, set_cost(450,0,0,0,0,0,0)),
 ('Zamek', 'Kawalerzysta', '6', false, set_cost(1000,0,0,0,0,0,0)),('Zamek', 'Czempion', '6', true, set_cost(1200,0,0,0,0,0,0)),
 ('Zamek', 'Anio??', '7', false, set_cost(3000,0,0,0,0,0,1)),('Zamek', 'Archanio??', '7', true, set_cost(5000,0,0,0,0,0,3));

-- Insert data for castle Bastion
INSERT INTO unit(castle_name, name, level, upgraded, cost_id) VALUES
 ('Bastion', 'Centaur', '1', false, set_cost(70,0,0,0,0,0,0)),('Bastion', 'Centaur bojowy', '1', true, set_cost(90,0,0,0,0,0,0)),
 ('Bastion', 'Krasnolud', '2', false, set_cost(120,0,0,0,0,0,0)),('Bastion', 'Krasnoludzki wojownik', '2', true, set_cost(150,0,0,0,0,0,0)),
 ('Bastion', 'Elf', '3', false, set_cost(200,0,0,0,0,0,0)),('Bastion', 'Wysoki elf', '3', true, set_cost(225,0,0,0,0,0,0)),
 ('Bastion', 'Pegaz', '4', false, set_cost(250,0,0,0,0,0,0)),('Bastion', 'Srebrny pegaz', '4', true, set_cost(275,0,0,0,0,0,0)),
 ('Bastion', 'Drzewiec', '5', false, set_cost(350,0,0,0,0,0,0)),('Bastion', 'Ent', '5', true, set_cost(425,0,0,0,0,0,0)),
 ('Bastion', 'Jednoro??ec', '6', false, set_cost(850,0,0,0,0,0,0)),('Bastion', 'Jednoro??ec bitewny', '6', true, set_cost(950,0,0,0,0,0,0)),
 ('Bastion', 'Zielony smok', '7', false, set_cost(2400,0,0,0,0,1,0)),('Bastion', 'Z??oty smok', '7', true, set_cost(4000,0,0,0,0,2,0));

INSERT INTO player(name) VALUES
 ('Chris'),
 ('Algato123'),
 ('Memoris3'),
 ('DeathLord'),
 ('marTaRoll'),
 ('GreDavStudio');
INSERT INTO map(name, size) VALUES 
 ('Wszyscy za jednego', 'M'), 
 ('Wyspy i jaskinie', 'L'), 
 ('Wy??cig o Ardintinny', 'XL'), 
 ('S??dny dzie??', 'S'),
 ('Mit i legenda', 'XL'),
 ('Martwi i pogrzebani', 'S'),
 ('Pi???? pier??cieni', 'L'),
 ('Rebelia', 'M'),
 ('Rozjemca', 'M'),
 ('Rycerz ciemno??ci', 'M');
INSERT INTO building(name, castle_name, level, cost_id) VALUES
 ('Rada osady', 'Zamek', 0, set_cost(0,0,0,0,0,0,0)),
 ('Rada miasta', 'Zamek', 1, set_cost(2500,0,0,0,0,0,0)),
 ('Ratusz', 'Zamek', 2, set_cost(5000,0,0,0,0,0,0)),
 ('Kapitol', 'Zamek', 3, set_cost(10000,0,0,0,0,0,0)),
 ('Cytadela', 'Zamek', 1, set_cost(2500,0,5,0,0,0,0)),
 ('Bractwo miecza', 'Zamek', 1, set_cost(500,5,0,0,0,0,0)),
 ('Ku??nia', 'Zamek', 1, set_cost(1000,5,0,0,0,0,0)),
 ('Karczma', 'Zamek', 1, set_cost(500,5,0,0,0,0,0)),
 ('Targowisko', 'Zamek', 1, set_cost(500,5,0,0,0,0,0)),
 ('Gildia mag??w poziom 1', 'Zamek', 1, set_cost(2000,5,5,0,0,0,0)),
 ('Gildia mag??w poziom 2', 'Zamek', 2, set_cost(1000,5,5,4,4,4,4)),
 ('Gildia mag??w poziom 3', 'Zamek', 3, set_cost(1000,5,5,6,6,6,6)),
 ('Gildia mag??w poziom 4', 'Zamek', 4, set_cost(1000,5,5,8,8,8,8)),
 ('Stra??nica', 'Zamek', 1, set_cost(500,0,10,0,0,0,0)),
 ('Ulepszona Stra??nica', 'Zamek', 2, set_cost(1000,0,5,0,0,0,0)),
 ('Koszary', 'Zamek', 1, set_cost(2000,0,5,0,0,0,0)),
 ('Klasztor', 'Zamek', 1, set_cost(3000,5,5,2,2,2,2)),
 ('Ulepszony Klasztor', 'Zamek', 2, set_cost(1000,2,2,2,2,2,2));
INSERT INTO requirement(building_name, castle_name, requirement_name) VALUES
 ('Gildia mag??w poziom 2', 'Zamek', 'Gildia mag??w poziom 1'),
 ('Gildia mag??w poziom 3', 'Zamek', 'Gildia mag??w poziom 2'),
 ('Gildia mag??w poziom 4', 'Zamek', 'Gildia mag??w poziom 3'),
 ('Ulepszony Klasztor', 'Zamek', 'Klasztor'),
 ('Klasztor', 'Zamek', 'Koszary'),
 ('Koszary', 'Zamek', 'Ku??nia'),
 ('Rada miasta', 'Zamek', 'Rada osady'),
 ('Rada miasta', 'Zamek', 'Karczma'),
 ('Ratusz', 'Zamek', 'Rada miasta'),
 ('Ratusz', 'Zamek', 'Gildia mag??w poziom 1'),
 ('Ratusz', 'Zamek', 'Targowisko'),
 ('Ratusz', 'Zamek', 'Ku??nia'),
 ('Kapitol', 'Zamek', 'Ratusz'),
 ('Kapitol', 'Zamek', 'Ku??nia');

-- Ciekawe query do por??wnania cen jednostek mi??dzy Zamekiem a Bastionem, dzia??a ale trzeba pami??ta?? o zmianie nazwy kolumn, bo inaczej si?? psuje
-- SELECT u.name AS 'castle unit', c.gold AS 'castle cost', n.name AS 'bastion unit', o.gold AS 'bastion cost', (c.gold - o.gold) AS diff, u.level, u.upgraded FROM unit u join (cost c,unit n,cost o) ON (u.cost_id = c.id AND n.cost_id = o.id AND u.level = n.level AND u.name != n.name AND u.castle_name != n.castle_name AND u.upgraded = n.upgraded) WHERE u.castle_name = 'Zamek' ORDER BY u.level, u.upgraded;
SELECT b.name, b.castle_name, level, r.requirement_name, gold, wood, ore, mercury, sulfur, crystal, gems FROM building b JOIN cost c LEFT JOIN requirement r ON (cost_id = id AND b.name = r.building_name);