-- Set up cocktails DB
DROP DATABASE IF EXISTS cocktails;
CREATE DATABASE cocktails;

-- Use cocktails DB
USE cocktails;

-- Location (city) where the cocktail was invented
CREATE TABLE location (
    location_id INT PRIMARY KEY AUTO_INCREMENT,
    city VARCHAR(20) NOT NULL
);

-- Ingredient 
CREATE TABLE ingredient (
    ingredient_id INT PRIMARY KEY AUTO_INCREMENT,
    ingredient_name VARCHAR(30) NOT NULL
);

-- Garnish
CREATE TABLE garnish (
    garnish_id INT PRIMARY KEY AUTO_INCREMENT,
    garnish_name VARCHAR(30) NOT NULL
);

-- Glassware
CREATE TABLE glassware (
    glassware_id INT PRIMARY KEY AUTO_INCREMENT,
    glassware_name VARCHAR(15) NOT NULL
);

-- Preparation
CREATE TABLE preparation (
    step_id INT PRIMARY KEY AUTO_INCREMENT,
    step_description VARCHAR(256) NOT NULL
);

-- Bar
CREATE TABLE bar (
    bar_id INT PRIMARY KEY AUTO_INCREMENT,
    bar_name VARCHAR(30) NOT NULL,
    location INT NOT NULL,
    CONSTRAINT bar_location_fk FOREIGN KEY (location)
        REFERENCES location (location_id)
        ON UPDATE CASCADE ON DELETE RESTRICT
);

-- Bartender
CREATE TABLE bartender (
    bartender_id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(10) NOT NULL,
    last_name VARCHAR(15) NOT NULL,
    bar INT NOT NULL,
    CONSTRAINT bartender_bar_fk FOREIGN KEY (bar)
        REFERENCES bar (bar_id)
        ON UPDATE CASCADE ON DELETE RESTRICT
);

-- Cocktails
CREATE TABLE cocktail (
    cocktail_id INT PRIMARY KEY AUTO_INCREMENT,
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

-- Cocktails and ingredients
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
        ON UPDATE CASCADE ON DELETE RESTRICT
);

-- Cocktails and garnishes
CREATE TABLE cocktail_garnishes (
    cocktail INT NOT NULL,
    garnish INT NOT NULL,
    amount VARCHAR(30) NOT NULL,
    CONSTRAINT cocktail_garnishes_pk PRIMARY KEY (cocktail, garnish),
    CONSTRAINT cg_cocktail_fk FOREIGN KEY (cocktail)
        REFERENCES cocktail (cocktail_id)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT cg_garnish_fk FOREIGN KEY (garnish)
        REFERENCES garnish (garnish_id)
        ON UPDATE CASCADE ON DELETE RESTRICT
);

-- Cocktails and preparations
CREATE TABLE cocktail_steps (
    cocktail INT NOT NULL,
    step INT NOT NULL,
    CONSTRAINT cocktail_steps_pk PRIMARY KEY (cocktail , step),
    CONSTRAINT cs_cocktail_fk FOREIGN KEY (cocktail)
        REFERENCES cocktail (cocktail_id)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT cs_step_fk FOREIGN KEY (step)
        REFERENCES preparation (step_id)
        ON UPDATE CASCADE ON DELETE RESTRICT
);


