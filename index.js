var mysql = require('mysql');
var cors = require('cors');
const express = require('express');
const app = express();

app.use(cors());

var con = mysql.createConnection({
    host: 'us-cdbr-iron-east-05.cleardb.net',
    user: 'b912905bc8ad2c',
    password: '1a5c658a',
    database: 'heroku_1549d99746341be',
    port: 3306
});

con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
});

// Function to be run right away to set up all
// the tables needed for the cocktails web app
function setUpTables() {
    // Location (city) where the cocktail was invented
    con.query('CREATE TABLE location (\n' +
        '    location_id INT PRIMARY KEY,\n' +
        '    city VARCHAR(20) NOT NULL\n' +
        ')');

    // Each tuple represents a single ingredient that may be used in a cocktail
    con.query('CREATE TABLE ingredient (\n' +
        '    ingredient_id INT PRIMARY KEY,\n' +
        '    ingredient_name VARCHAR(30) NOT NULL\n' +
        ')');

    // Each tuple represents a single garnish that may be used in a cocktail
    con.query('CREATE TABLE garnish (\n' +
        '    garnish_id INT PRIMARY KEY,\n' +
        '    garnish_name VARCHAR(30) NOT NULL\n' +
        ')');

    // Each tuple represents glassware that a cocktail may be served in
    con.query('CREATE TABLE glassware (\n' +
        '    glassware_id INT PRIMARY KEY,\n' +
        '    glassware_name VARCHAR(15) NOT NULL\n' +
        ')');

    // Each tuple is a step in the cocktail preparation process
    con.query('CREATE TABLE preparation (\n' +
        '    step_id INT PRIMARY KEY,\n' +
        '    step VARCHAR(256) NOT NULL\n' +
        ')');

    // Bar the cocktail was invented at
    con.query('CREATE TABLE bar (\n' +
        '    bar_id INT PRIMARY KEY,\n' +
        '    bar_name VARCHAR(30) NOT NULL,\n' +
        '    location INT NOT NULL,\n' +
        '    CONSTRAINT bar_location_fk FOREIGN KEY (location)\n' +
        '        REFERENCES location (location_id)\n' +
        '        ON UPDATE CASCADE ON DELETE NO ACTION\n' +
        ')');

    // Bartender who invented the cocktail
    con.query('CREATE TABLE bartender (\n' +
        '    bartender_id INT PRIMARY KEY,\n' +
        '    first_name VARCHAR(10) NOT NULL,\n' +
        '    last_name VARCHAR(15) NOT NULL,\n' +
        '    bar INT NOT NULL,\n' +
        '    CONSTRAINT bartender_bar_fk FOREIGN KEY (bar)\n' +
        '        REFERENCES bar (bar_id)\n' +
        '        ON UPDATE CASCADE ON DELETE NO ACTION\n' +
        ')');

    // Each tuple represents a cocktail. Joins across multiple tables
    // in the DB will produce a cocktail recipe. Each cocktail is created
    // by only one bartender and served in only one type of glass
    con.query('CREATE TABLE cocktail (\n' +
        '    cocktail_id INT PRIMARY KEY,\n' +
        '    cocktail_name VARCHAR(30) NOT NULL,\n' +
        '    bartender INT,\n' +
        '    glassware INT,\n' +
        '    CONSTRAINT bartender_cocktail_fk FOREIGN KEY (bartender)\n' +
        '        REFERENCES bartender (bartender_id)\n' +
        '        ON UPDATE CASCADE ON DELETE SET NULL,\n' +
        '    CONSTRAINT glassware_cocktail_fk FOREIGN KEY (glassware)\n' +
        '        REFERENCES glassware (glassware_id)\n' +
        '        ON UPDATE CASCADE ON DELETE SET NULL\n' +
        ')');

    // Ingredients that make up a cocktail
    // If a cocktail is updated/deleted, the tuples here should cascade
    // A parent ingredient cannot be deleted if it is used in a cocktail
    con.query('CREATE TABLE cocktail_ingredients (\n' +
        '    cocktail INT NOT NULL,\n' +
        '    ingredient INT NOT NULL,\n' +
        '    amount VARCHAR(30) NOT NULL,\n' +
        '    CONSTRAINT cocktail_ingredients_pk PRIMARY KEY (cocktail, ingredient),\n' +
        '    CONSTRAINT ci_cocktail_fk FOREIGN KEY (cocktail)\n' +
        '        REFERENCES cocktail (cocktail_id)\n' +
        '        ON UPDATE CASCADE ON DELETE CASCADE,\n' +
        '    CONSTRAINT ci_ingredient_fk FOREIGN KEY (ingredient)\n' +
        '        REFERENCES ingredient (ingredient_id)\n' +
        '        ON UPDATE CASCADE ON DELETE NO ACTION\n' +
        ')');

    // Garnishes used in a cocktail
    // If a cocktail is updated/deleted, the tuples here should cascade
    // A parent garnish cannot be deleted if it is used in a cocktail
    con.query('CREATE TABLE cocktail_garnishes (\n' +
        '    cocktail INT NOT NULL,\n' +
        '    garnish INT NOT NULL,\n' +
        '    amount VARCHAR(30) NOT NULL,\n' +
        '    CONSTRAINT cocktail_garnishes_pk PRIMARY KEY (cocktail , garnish),\n' +
        '    CONSTRAINT cg_cocktail_fk FOREIGN KEY (cocktail)\n' +
        '        REFERENCES cocktail (cocktail_id)\n' +
        '        ON UPDATE CASCADE ON DELETE CASCADE,\n' +
        '    CONSTRAINT cg_garnish_fk FOREIGN KEY (garnish)\n' +
        '        REFERENCES garnish (garnish_id)\n' +
        '        ON UPDATE CASCADE ON DELETE NO ACTION\n' +
        ')');

    // Preparation required to make a cocktail
    // If a cocktail is updated/deleted, the tuples here should cascade
    // A parent step cannot be deleted if it is used in a cocktail
    con.query('CREATE TABLE cocktail_steps (\n' +
        '    cocktail INT NOT NULL,\n' +
        '    step INT NOT NULL,\n' +
        '    CONSTRAINT cocktail_steps_pk PRIMARY KEY (cocktail , step),\n' +
        '    CONSTRAINT cs_cocktail_fk FOREIGN KEY (cocktail)\n' +
        '        REFERENCES cocktail (cocktail_id)\n' +
        '        ON UPDATE CASCADE ON DELETE CASCADE,\n' +
        '    CONSTRAINT cs_step_fk FOREIGN KEY (step)\n' +
        '        REFERENCES preparation (step_id)\n' +
        '        ON UPDATE CASCADE ON DELETE NO ACTION\n' +
        ')');
}

function insertMockData() {
    con.query('INSERT INTO ingredient (ingredient_id, ingredient_name) VALUES (1, \'rum\'), (2, \'gin\'), (3, \'tequila\'), (4, \'whiskey\'), (5, \'vodka\')');
}

// Set up DB for app
// setUpTables();
// insertMockData();

app.get('/', (req, res) => {
    const id = req.params.id;
    con.query('SELECT * FROM ingredient', function (error, results) {
        if (error) throw error;
        res.send(results);
    });
});

app.listen(process.env.PORT || 8000, () => {
    console.log('Example app listening on port 8000!')
});