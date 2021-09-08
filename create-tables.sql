DROP TABLE token;
DROP TABLE game_player;
DROP TABLE maps;
DROP TABLE unit;
DROP TABLE building;
DROP TABLE game;
DROP TABLE player;
DROP TABLE cost;
DROP TABLE castle;

CREATE OR REPLACE TABLE castle(
    name VARCHAR(30) CHARACTER SET utf8 NOT NULL PRIMARY KEY
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
    CONSTRAINT unit_fk_castle FOREIGN KEY (castle_name) REFERENCES castle (name),
    CONSTRAINT unit_fk_cost FOREIGN KEY (cost_id) REFERENCES cost (id)
);
CREATE OR REPLACE TABLE maps(
    name VARCHAR(30) CHARACTER SET utf8 NOT NULL PRIMARY KEY,
    size VARCHAR(5)
);
CREATE OR REPLACE TABLE building(
    name VARCHAR(30) CHARACTER SET utf8 NOT NULL PRIMARY KEY,
    castle_name VARCHAR(30) CHARACTER SET utf8,
    unit_level INTEGER,
    cost_id INTEGER,
    CONSTRAINT building_fk_castle FOREIGN KEY (castle_name) REFERENCES castle (name),
    CONSTRAINT building_fk_cost FOREIGN KEY (cost_id) REFERENCES cost (id)
);
CREATE OR REPLACE TABLE player(
    name VARCHAR(30) CHARACTER SET utf8 NOT NULL PRIMARY KEY
);
CREATE OR REPLACE TABLE token(
    token CHAR(20) NOT NULL PRIMARY KEY
);
CREATE OR REPLACE TABLE game(
    id INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT
);
CREATE OR REPLACE TABLE game_player(
    game_id INTEGER NOT NULL,
    player_name VARCHAR(30) CHARACTER SET utf8 NOT NULL,
    PRIMARY KEY (game_id, player_name),
    CONSTRAINT game_player_game_fk FOREIGN KEY (game_id) REFERENCES game (id),
    CONSTRAINT game_player_player_fk FOREIGN KEY (player_name) REFERENCES player (name)
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
END;
DELIMITER ;

INSERT INTO castle(name) VALUES ('Zamek'),('Inferno'),('Forteca'),('Twierdza'),('Bastion'),('Wrota Żywiołów'),('Nekropolia'),('Loch'),('Cytadela');

-- Insert data for castle Zamek
INSERT INTO unit(castle_name, name, level, upgraded, cost_id) VALUES
 ('Zamek', 'Pikinier', '1', false, set_cost(60,0,0,0,0,0,0)),('Zamek', 'Halabardnik', '1', true, set_cost(75,0,0,0,0,0,0)),
 ('Zamek', 'Łucznik', '2', false, set_cost(100,0,0,0,0,0,0)),('Zamek', 'Kusznik', '2', true, set_cost(150,0,0,0,0,0,0)),
 ('Zamek', 'Gryf', '3', false, set_cost(200,0,0,0,0,0,0)),('Zamek', 'Gryf królewski', '3', true, set_cost(240,0,0,0,0,0,0)),
 ('Zamek', 'Zbrojny', '4', false, set_cost(300,0,0,0,0,0,0)),('Zamek', 'Krzyżowiec', '4', true, set_cost(400,0,0,0,0,0,0)),
 ('Zamek', 'Mnich', '5', false, set_cost(400,0,0,0,0,0,0)),('Zamek', 'Kapłan', '5', true, set_cost(450,0,0,0,0,0,0)),
 ('Zamek', 'Kawalerzysta', '6', false, set_cost(1000,0,0,0,0,0,0)),('Zamek', 'Czempion', '6', true, set_cost(1200,0,0,0,0,0,0)),
 ('Zamek', 'Anioł', '7', false, set_cost(3000,0,0,0,0,0,1)),('Zamek', 'Archanioł', '7', true, set_cost(5000,0,0,0,0,0,3));

-- Insert data for castle Bastion
INSERT INTO unit(castle_name, name, level, upgraded, cost_id) VALUES
 ('Bastion', 'Centaur', '1', false, set_cost(70,0,0,0,0,0,0)),('Bastion', 'Centaur bojowy', '1', true, set_cost(90,0,0,0,0,0,0)),
 ('Bastion', 'Krasnolud', '2', false, set_cost(120,0,0,0,0,0,0)),('Bastion', 'Krasnoludzki wojownik', '2', true, set_cost(150,0,0,0,0,0,0)),
 ('Bastion', 'Elf', '3', false, set_cost(200,0,0,0,0,0,0)),('Bastion', 'Wysoki elf', '3', true, set_cost(225,0,0,0,0,0,0)),
 ('Bastion', 'Pegaz', '4', false, set_cost(250,0,0,0,0,0,0)),('Bastion', 'Srebrny pegaz', '4', true, set_cost(275,0,0,0,0,0,0)),
 ('Bastion', 'Drzewiec', '5', false, set_cost(350,0,0,0,0,0,0)),('Bastion', 'Ent', '5', true, set_cost(425,0,0,0,0,0,0)),
 ('Bastion', 'Jednorożec', '6', false, set_cost(850,0,0,0,0,0,0)),('Bastion', 'Jednorożec bitewny', '6', true, set_cost(950,0,0,0,0,0,0)),
 ('Bastion', 'Zielony smok', '7', false, set_cost(2400,0,0,0,0,1,0)),('Bastion', 'Złoty smok', '7', true, set_cost(4000,0,0,0,0,2,0));

-- Ciekawe query do porównania cen jednostek między Zamekiem a Bastionem, działa ale trzeba pamiętać o zmianie nazwy kolumn, bo inaczej się psuje
SELECT u.name AS 'castle unit', c.gold AS 'castle cost', n.name AS 'bastion unit', o.gold AS 'bastion cost', (c.gold - o.gold) AS diff, u.level, u.upgraded FROM unit u join (cost c,unit n,cost o) ON (u.cost_id = c.id AND n.cost_id = o.id AND u.level = n.level AND u.name != n.name AND u.castle_name != n.castle_name AND u.upgraded = n.upgraded) WHERE u.castle_name = 'Zamek' ORDER BY u.level, u.upgraded;