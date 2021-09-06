CREATE OR REPLACE TABLE castle(
    name VARCHAR(30) NOT NULL PRIMARY KEY
);
CREATE OR REPLACE TABLE unit(
    name VARCHAR(30) NOT NULL,
    castle_name VARCHAR(30),
    level INTEGER,
    upgraded BOOLEAN,
    cost INTEGER,
    PRIMARY KEY (name, castle_name),
    CONSTRAINT unit_fk_castle FOREIGN KEY (castle_name) REFERENCES castle (name)
);
CREATE OR REPLACE TABLE maps(
    name VARCHAR(30) NOT NULL PRIMARY KEY,
    size VARCHAR(5)
);
CREATE OR REPLACE TABLE building(
    name VARCHAR(30) NOT NULL,
    castle_name VARCHAR(30),
    unit_level INTEGER,
    PRIMARY KEY (name, castle_name),
    CONSTRAINT building_fk_castle FOREIGN KEY (castle_name) REFERENCES castle (name)
);
CREATE OR REPLACE TABLE player(
    name VARCHAR(30) NOT NULL PRIMARY KEY
);
CREATE OR REPLACE TABLE token(
    token CHAR(20) NOT NULL PRIMARY KEY
);
CREATE OR REPLACE TABLE game(
    id INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT
);
CREATE OR REPLACE TABLE game_player(
    game_id INTEGER NOT NULL,
    player_name VARCHAR(30) NOT NULL,
    PRIMARY KEY (game_id, player_name),
    CONSTRAINT game_player_game_fk FOREIGN KEY (game_id) REFERENCES game (id),
    CONSTRAINT game_player_player_fk FOREIGN KEY (player_name) REFERENCES player (name)
);

-- Here should be Insert part so initalization of database
INSERT INTO castle(name) VALUES ('Zamek'),('Inferno'),('Forteca'),('Twierdza'),('Bastion'),('Wrota Zywiolow'),('Nekropolia'),('Loch'),('Cytadela');
INSERT INTO unit(castle_name, name, level, upgraded, cost) VALUES ('Zamek', 'Pikinier', '1', false, 60),('Zamek', 'Halabardnik', '1', true, 75);
