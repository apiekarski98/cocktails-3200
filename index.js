const mysql = require('mysql');
const cors = require('cors');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cors());

var con;

function handleDisconnect() {
    con = mysql.createConnection({
        host: 'us-cdbr-iron-east-05.cleardb.net',
        user: 'b912905bc8ad2c',
        password: '1a5c658a',
        database: 'heroku_1549d99746341be',
        port: 3306
    });

    con.connect(function (err) {              // The server is either down
        if (err) {                                     // or restarting (takes a while sometimes).
            setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
        }                                     // to avoid a hot loop, and to allow our node script to
    });                                     // process asynchronous requests in the meantime.
                                            // If you're also serving http, display a 503 error.
    con.on('error', function (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
            handleDisconnect();                         // lost due to either server restart, or a
        } else {                                      // connnection idle timeout (the wait_timeout
            throw err;                                  // server variable configures this)
        }
    });
}

handleDisconnect();

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

// GET APIs
app.get('/api/ingredient',
    (req, res) => {
        con.query('SELECT * FROM ingredient',
            function (error, results) {
                if (error) throw error;
                res.send(results);
            });
    });

app.get('/api/ingredient/:ingredient_id',
    (req, res) => {
        const id = req.params.ingredient_id;
        con.query('SELECT * FROM ingredient WHERE ingredient_id = ?',
            id,
            function (error, results) {
                if (error) throw error;
                res.send(results);
            });
    });

app.get('/api/garnish',
    (req, res) => {
        con.query('SELECT * FROM garnish',
            function (error, results) {
                if (error) throw error;
                res.send(results);
            });
    });

app.get('/api/garnish/:garnish_id',
    (req, res) => {
        const id = req.params.garnish_id;
        con.query('SELECT * FROM garnish WHERE garnish_id = ?',
            id,
            function (error, results) {
                if (error) throw error;
                res.send(results);
            });
    });

app.get('/api/location',
    (req, res) => {
        con.query('SELECT * FROM location',
            function (error, results) {
                if (error) throw error;
                res.send(results);
            });
    });

app.get('/api/location/:location_id',
    (req, res) => {
        const id = req.params.location_id;
        con.query('SELECT * FROM location WHERE location_id = ?',
            id,
            function (error, results) {
                if (error) throw error;
                res.send(results);
            });
    });

app.get('/api/glassware',
    (req, res) => {
        con.query('SELECT * FROM glassware',
            function (error, results) {
                if (error) throw error;
                res.send(results);
            });
    });

app.get('/api/glassware/:glassware_id',
    (req, res) => {
        const id = req.params.glassware_id;
        con.query('SELECT * FROM glassware WHERE glassware_id = ?',
            id,
            function (error, results) {
                if (error) throw error;
                res.send(results);
            });
    });

app.get('/api/preparation',
    (req, res) => {
        con.query('SELECT * FROM preparation',
            function (error, results) {
                if (error) throw error;
                res.send(results);
            });
    });

app.get('/api/preparation/:step_id',
    (req, res) => {
        const id = req.params.step_id;
        con.query('SELECT * FROM preparation WHERE step_id = ?',
            id,
            function (error, results) {
                if (error) throw error;
                res.send(results);
            });
    });

app.get('/api/bar',
    (req, res) => {
        con.query('SELECT * FROM bar',
            function (error, results) {
                if (error) throw error;
                res.send(results);
            });
    });

app.get('/api/bar/:bar_id',
    (req, res) => {
        const id = req.params.bar_id;
        con.query('SELECT bar_id, bar_name, location, city FROM bar JOIN location ON bar.location = location.location_id WHERE bar_id = ?',
            id,
            function (error, results) {
                if (error) throw error;
                res.send(results);
            });
    });

// PUT APIs
app.put('/api/ingredient',
    (req, res) => {
        con.query('SELECT MAX(ingredient_id) AS last_id FROM ingredient',
            function (error, results) {
                if (error) throw error;

                let new_id = results[0].last_id;
                if (new_id === null) {
                    new_id = 0;
                } else {
                    new_id = new_id + 1;
                }
                const ingredient = req.body.ingredient_name;

                con.query('INSERT INTO ingredient (ingredient_id, ingredient_name) VALUES (?, ?)',
                    [new_id, ingredient],
                    function (error, results) {
                        if (error) throw error;
                        res.send(results);
                    });
            });
    });

app.put('/api/garnish',
    (req, res) => {
        con.query('SELECT MAX(garnish_id) AS last_id FROM garnish',
            function (error, results) {
                if (error) throw error;

                let new_id = results[0].last_id;
                if (new_id === null) {
                    new_id = 0;
                } else {
                    new_id = new_id + 1;
                }
                const garnish = req.body.garnish_name;

                con.query('INSERT INTO garnish (garnish_id, garnish_name) VALUES (?, ?)',
                    [new_id, garnish],
                    function (error, results) {
                        if (error) throw error;
                        res.send(results);
                    });
            });
    });

app.put('/api/location',
    (req, res) => {
        con.query('SELECT MAX(location_id) AS last_id FROM location',
            function (error, results) {
                if (error) throw error;

                let new_id = results[0].last_id;
                if (new_id === null) {
                    new_id = 0;
                } else {
                    new_id = new_id + 1;
                }
                const { city } = req.body;

                con.query('INSERT INTO location (location_id, city) VALUES (?, ?)',
                    [new_id, city],
                    function (error, results) {
                        if (error) throw error;
                        res.send(results);
                    });
            });
    });

app.put('/api/glassware',
    (req, res) => {
        con.query('SELECT MAX(glassware_id) AS last_id FROM glassware',
            function (error, results) {
                if (error) throw error;

                let new_id = results[0].last_id;
                if (new_id === null) {
                    new_id = 0;
                } else {
                    new_id = new_id + 1;
                }
                const { glassware_name } = req.body;

                con.query('INSERT INTO glassware (glassware_id, glassware_name) VALUES (?, ?)',
                    [new_id, glassware_name],
                    function (error, results) {
                        if (error) throw error;
                        res.send(results);
                    });
            });
    });

app.put('/api/preparation',
    (req, res) => {
        con.query('SELECT MAX(step_id) AS last_id FROM preparation',
            function (error, results) {
                if (error) throw error;

                let new_id = results[0].last_id;
                if (new_id === null) {
                    new_id = 0;
                } else {
                    new_id = new_id + 1;
                }
                const { step } = req.body;

                con.query('INSERT INTO preparation (step_id, step) VALUES (?, ?)',
                    [new_id, step],
                    function (error, results) {
                        if (error) throw error;
                        res.send(results);
                    });
            });
    });

// POST APIs
app.post('/api/ingredient/:ingredient_id',
    (req, res) => {
        const id = req.params.ingredient_id;
        const ingredient = req.body.ingredient_name;
        con.query('UPDATE ingredient SET ingredient_name = ? WHERE ingredient_id = ?',
            [ingredient, id],
            function (error, results) {
                if (error) throw error;
                res.send(results);
            });
    });

app.post('/api/garnish/:garnish_id',
    (req, res) => {
        const id = req.params.garnish_id;
        const garnish = req.body.garnish_name;
        con.query('UPDATE garnish SET garnish_name = ? WHERE garnish_id = ?',
            [garnish, id],
            function (error, results) {
                if (error) throw error;
                res.send(results);
            });
    });

app.post('/api/location/:location_id',
    (req, res) => {
        const id = req.params.location_id;
        const { city } = req.body;
        con.query('UPDATE location SET city = ? WHERE location_id = ?',
            [city, id],
            function (error, results) {
                if (error) throw error;
                res.send(results);
            });
    });

app.post('/api/glassware/:glassware_id',
    (req, res) => {
        const id = req.params.glassware_id;
        const { glassware_name } = req.body;
        con.query('UPDATE glassware SET glassware_name = ? WHERE glassware_id = ?',
            [glassware_name, id],
            function (error, results) {
                if (error) throw error;
                res.send(results);
            });
    });

app.post('/api/preparation/:step_id',
    (req, res) => {
        const id = req.params.step_id;
        const { step } = req.body;
        con.query('UPDATE preparation SET step = ? WHERE step_id = ?',
            [step, id],
            function (error, results) {
                if (error) throw error;
                res.send(results);
            });
    });

// DELETE APIs
app.delete('/api/ingredient/:ingredient_id',
    (req, res) => {
        const id = req.params.ingredient_id;
        con.query('DELETE FROM ingredient WHERE ingredient_id = ?',
            id,
            function (error, results) {
                if (error) throw error;
                res.send(results);
            });
    });

app.delete('/api/garnish/:garnish_id',
    (req, res) => {
        const id = req.params.garnish_id;
        con.query('DELETE FROM garnish WHERE garnish_id = ?',
            id,
            function (error, results) {
                if (error) throw error;
                res.send(results);
            });
    });

app.delete('/api/location/:location_id',
    (req, res) => {
        const id = req.params.location_id;
        con.query('DELETE FROM location WHERE location_id = ?',
            id,
            function (error, results) {
                if (error) throw error;
                res.send(results);
            });
    });

app.delete('/api/glassware/:glassware_id',
    (req, res) => {
        const id = req.params.glassware_id;
        con.query('DELETE FROM glassware WHERE glassware_id = ?',
            id,
            function (error, results) {
                if (error) throw error;
                res.send(results);
            });
    });

app.delete('/api/preparation/:step_id',
    (req, res) => {
        const id = req.params.step_id;
        con.query('DELETE FROM preparation WHERE step_id = ?',
            id,
            function (error, results) {
                if (error) throw error;
                res.send(results);
            });
    });

app.delete('/api/bar/:bar_id',
    (req, res) => {
        const id = req.params.bar_id;
        con.query('DELETE FROM bar WHERE bar_id = ?',
            id,
            function (error, results) {
                if (error) throw error;
                res.send(results);
            });
    });

app.listen(process.env.PORT || 8000, () => {
    console.log('Example app listening on port 8000!')
});