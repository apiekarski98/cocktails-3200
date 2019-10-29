-- Set up cocktails DB
-- DROP DATABASE IF EXISTS cocktails;
-- CREATE DATABASE cocktails;
DROP DATABASE IF EXISTS heroku_1549d99746341be;
CREATE DATABASE heroku_1549d99746341be;

-- Use cocktails DB
USE heroku_1549d99746341be;

-- Location (city) where the cocktail was invented
CREATE TABLE location (
    location_id INT PRIMARY KEY,
    city VARCHAR(20) NOT NULL
);

-- Each tuple represents a single ingredient that may be used in a cocktail
CREATE TABLE ingredient (
    ingredient_id INT PRIMARY KEY,
    ingredient_name VARCHAR(30) NOT NULL
);

-- Each tuple represents a single garnish that may be used in a cocktail
CREATE TABLE garnish (
    garnish_id INT PRIMARY KEY,
    garnish_name VARCHAR(30) NOT NULL
);

-- Each tuple represents glassware that a cocktail may be served in
CREATE TABLE glassware (
    glassware_id INT PRIMARY KEY,
    glassware_name VARCHAR(15) NOT NULL
);

-- Each tuple is a step in the cocktail preparation process
CREATE TABLE preparation (
    step_id INT PRIMARY KEY,
    step VARCHAR(256) NOT NULL
);

-- Bar the cocktail was invented at
CREATE TABLE bar (
    bar_id INT PRIMARY KEY,
    bar_name VARCHAR(30) NOT NULL,
    location INT NOT NULL,
    CONSTRAINT bar_location_fk FOREIGN KEY (location)
        REFERENCES location (location_id)
        ON UPDATE CASCADE ON DELETE NO ACTION
);

-- Bartender who invented the cocktail
CREATE TABLE bartender (
    bartender_id INT PRIMARY KEY,
    first_name VARCHAR(10) NOT NULL,
    last_name VARCHAR(15) NOT NULL,
    bar INT NOT NULL,
    CONSTRAINT bartender_bar_fk FOREIGN KEY (bar)
        REFERENCES bar (bar_id)
        ON UPDATE CASCADE ON DELETE NO ACTION
);

-- Each tuple represents a cocktail. Joins across multiple tables
-- in the DB will produce a cocktail recipe. Each cocktail is created
-- by only one bartender and served in only one type of glass
CREATE TABLE cocktail (
    cocktail_id INT PRIMARY KEY,
    cocktail_name VARCHAR(30) NOT NULL,
    bartender INT,
    glassware INT,
    CONSTRAINT bartender_cocktail_fk FOREIGN KEY (bartender)
        REFERENCES bartender (bartender_id)
        ON UPDATE CASCADE ON DELETE SET NULL,
    CONSTRAINT glassware_cocktail_fk FOREIGN KEY (glassware)
        REFERENCES glassware (glassware_id)
        ON UPDATE CASCADE ON DELETE SET NULL
);

-- Ingredients that make up a cocktail
-- If a cocktail is updated/deleted, the tuples here should cascade
-- A parent ingredient cannot be deleted if it is used in a cocktail
CREATE TABLE cocktail_ingredients (
    cocktail INT NOT NULL,
    ingredient INT NOT NULL,
    amount VARCHAR(30) NOT NULL,
    CONSTRAINT cocktail_ingredients_pk PRIMARY KEY (cocktail, ingredient),
    CONSTRAINT ci_cocktail_fk FOREIGN KEY (cocktail)
        REFERENCES cocktail (cocktail_id)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT ci_ingredient_fk FOREIGN KEY (ingredient)
        REFERENCES ingredient (ingredient_id)
        ON UPDATE CASCADE ON DELETE NO ACTION
);

-- Garnishes used in a cocktail
-- If a cocktail is updated/deleted, the tuples here should cascade
-- A parent garnish cannot be deleted if it is used in a cocktail
CREATE TABLE cocktail_garnishes (
    cocktail INT NOT NULL,
    garnish INT NOT NULL,
    amount VARCHAR(30) NOT NULL,
    CONSTRAINT cocktail_garnishes_pk PRIMARY KEY (cocktail , garnish),
    CONSTRAINT cg_cocktail_fk FOREIGN KEY (cocktail)
        REFERENCES cocktail (cocktail_id)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT cg_garnish_fk FOREIGN KEY (garnish)
        REFERENCES garnish (garnish_id)
        ON UPDATE CASCADE ON DELETE NO ACTION
);

-- Preparation required to make a cocktail
-- If a cocktail is updated/deleted, the tuples here should cascade
-- A parent step cannot be deleted if it is used in a cocktail
CREATE TABLE cocktail_steps (
    cocktail INT NOT NULL,
    step INT NOT NULL,
    CONSTRAINT cocktail_steps_pk PRIMARY KEY (cocktail , step),
    CONSTRAINT cs_cocktail_fk FOREIGN KEY (cocktail)
        REFERENCES cocktail (cocktail_id)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT cs_step_fk FOREIGN KEY (step)
        REFERENCES preparation (step_id)
        ON UPDATE CASCADE ON DELETE NO ACTION
);

INSERT INTO ingredient (ingredient_id, ingredient_name) VALUES (1, 'rum');
INSERT INTO ingredient (ingredient_id, ingredient_name) VALUES (2, 'gin');
INSERT INTO ingredient (ingredient_id, ingredient_name) VALUES (3, 'whiskey');
INSERT INTO ingredient (ingredient_id, ingredient_name) VALUES (4, 'vodka');
INSERT INTO ingredient (ingredient_id, ingredient_name) VALUES (5, 'tequila');