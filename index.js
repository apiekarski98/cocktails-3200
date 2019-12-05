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

app.get('/api/bartender',
    (req, res) => {
        con.query('SELECT * FROM bartender',
            function (error, results) {
                if (error) throw error;
                res.send(results);
            });
    });

app.get('/api/bartender/:bartender_id',
    (req, res) => {
        const id = req.params.bartender_id;
        con.query('SELECT bartender_id, first_name, last_name, bar, bar_name FROM bartender JOIN bar ON bar.bar_id = bartender.bar WHERE bartender_id = ?',
            id,
            function (error, results) {
                if (error) throw error;
                res.send(results);
            });
    });

app.get('/api/cocktail', (req, res) => {
    con.query('SELECT * FROM cocktail',
        function (error, results) {
            if (error) throw error;
            res.send(results);
        });
});

app.get('/api/cocktail/:cocktail_id', (req, res) => {
    const {cocktail_id} = req.params;
    con.query('SELECT * FROM cocktail WHERE cocktail_id = ?',
        cocktail_id,
        function (error, results) {
            if (error) throw error;
            res.send(results);
        });
});

app.get('/api/cocktail/:cocktail_id/ingredient', (req, res) => {
    const {cocktail_id} = req.params;
    con.query('SELECT amount, ingredient_name FROM cocktail_ingredients JOIN ingredient ON cocktail_ingredients.ingredient = ingredient.ingredient_id WHERE cocktail = ?',
        cocktail_id,
        function (error, results) {
            if (error) throw error;
            res.send(results);
        });
});

app.get('/api/cocktail/:cocktail_id/garnish', (req, res) => {
    const {cocktail_id} = req.params;
    con.query('SELECT amount, garnish_name FROM cocktail_garnishes JOIN garnish ON cocktail_garnishes.garnish = garnish.garnish_id WHERE cocktail = ?',
        cocktail_id,
        function (error, results) {
            if (error) throw error;
            res.send(results);
        });
});

app.get('/api/cocktail/:cocktail_id/preparation', (req, res) => {
    const {cocktail_id} = req.params;
    con.query('SELECT preparation.step FROM cocktail_steps JOIN preparation USING (step) WHERE cocktail = ?',
        cocktail_id,
        function (error, results) {
            if (error) throw error;
            res.send(results);
        });
});

// PUT APIs
app.put('/api/ingredient',
    (req, res) => {
        const {ingredient_name} = req.body;
        con.query('CALL add_ingredient(?)',
            ingredient_name,
            function (error, results) {
                if (error) throw error;
                res.send(results);
            });
    });

app.put('/api/garnish',
    (req, res) => {
        const {garnish_name} = req.body;
        con.query('CALL add_garnish(?)',
            garnish_name,
            function (error, results) {
                if (error) throw error;
                res.send(results);
            });
    });

app.put('/api/location',
    (req, res) => {
        const {city} = req.body;
        con.query('CALL add_location(?)',
            city,
            function (error, results) {
                if (error) throw error;
                res.send(results);
            });
    });

app.put('/api/glassware',
    (req, res) => {
        const {glassware_name} = req.body;
        con.query('CALL add_glassware(?)',
            glassware_name,
            function (error, results) {
                if (error) throw error;
                res.send(results);
            });
    });

app.put('/api/preparation',
    (req, res) => {
        const {step} = req.body;
        con.query('CALL add_step(?)',
            step,
            function (error, results) {
                if (error) throw error;
                res.send(results);
            });
    });

app.put('/api/bar',
    (req, res) => {
    const {bar_name, location} = req.body;
    con.query('CALL add_new_bar(?,?)',
        [bar_name, location],
        function (error, results) {
            if (error) throw error;
            res.send(results);
        });
});

app.put('/api/bartender',
    (req, res) => {
    const {first_name, last_name, bar} = req.body;
    con.query('CALL add_new_bartender(?,?,?)',
        [first_name, last_name, bar],
        function (error, results) {
            if (error) throw error;
            res.send(results);
        });
});

app.put('/api/cocktail',
    (req, res) => {
    const {cocktail_name} = req.body;
    con.query('CALL add_cocktail(?)',
        cocktail_name,
        function (error, results) {
            if (error) throw error;
            res.send(results);
        });
});

app.put('/api/cocktail/:cocktail_id/add-ingredient/:ingredient_id',
    (req, res) => {
    const {cocktail_id, ingredient_id} = req.params;
    const {ingredient_amount} = req.body;
    con.query('INSERT INTO cocktail_ingredients (cocktail, ingredient, amount) VALUES (?,?,?)',
        [cocktail_id, ingredient_id, ingredient_amount],
        function (error, results) {
            if (error) throw error;
            res.send(results);
        });
});

app.put('/api/cocktail/:cocktail_id/add-garnish/:garnish_id',
    (req, res) => {
        const {cocktail_id, garnish_id} = req.params;
        const {garnish_amount} = req.body;
        con.query('INSERT INTO cocktail_garnishes (cocktail, garnish, amount) VALUES (?,?,?)',
            [cocktail_id, garnish_id, garnish_amount],
            function (error, results) {
                if (error) throw error;
                res.send(results);
            });
    });

app.put('/api/cocktail/:cocktail_id/add-step/:step_id',
    (req, res) => {
        const {cocktail_id, step_id} = req.params;
        con.query('INSERT INTO cocktail_steps (cocktail, step) VALUES (?,?)',
            [cocktail_id, step_id],
            function (error, results) {
                if (error) throw error;
                res.send(results);
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
        const {city} = req.body;
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
        const {glassware_name} = req.body;
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
        const {step} = req.body;
        con.query('UPDATE preparation SET step = ? WHERE step_id = ?',
            [step, id],
            function (error, results) {
                if (error) throw error;
                res.send(results);
            });
    });

app.post('/api/bar/:bar_id',
    (req, res) => {
        const id = req.params.bar_id;
        const {bar_name, location} = req.body;
        con.query('CALL update_bar(?,?,?)',
            [id, bar_name, location],
            function (error, results) {
                if (error) throw error;
                res.send(results);
            });
    });

app.post('/api/bartender/:bartender_id',
    (req, res) => {
        const id = req.params.bartender_id;
        const {first_name, last_name, bar} = req.body;
        con.query('CALL update_bartender(?,?,?,?)',
            [id, first_name, last_name, bar],
            function (error, results) {
                if (error) throw error;
                res.send(results);
            });
    });

app.post('/api/cocktail/:cocktail_id',
    (req, res) => {
        const id = req.params.cocktail_id;
        const {cocktail_name} = req.body;
        con.query('UPDATE cocktail SET cocktail_name = ? WHERE cocktail_id = ?',
            [cocktail_name, id],
            function (error, results) {
                if (error) throw error;
                res.send(results);
            });
    });

app.post('/api/cocktail/:cocktail_id/add-bartender/:bartender_id',
    (req, res) => {
        const {cocktail_id, bartender_id} = req.params;
        con.query('UPDATE cocktail SET bartender = ? WHERE cocktail_id = ?',
            [bartender_id, cocktail_id],
            function (error, results) {
                if (error) throw error;
                res.send(results);
            });
    }
);

app.post('/api/cocktail/:cocktail_id/remove-bartender',
    (req, res) => {
        const {cocktail_id} = req.params;
        con.query('UPDATE cocktail SET bartender = NULL WHERE cocktail_id = ?',
            cocktail_id,
            function (error, results) {
                if (error) throw error;
                res.send(results);
            });
    }
);

app.post('/api/cocktail/:cocktail_id/add-glassware/:glassware_id',
    (req, res) => {
        const {cocktail_id, glassware_id} = req.params;
        con.query('UPDATE cocktail SET glassware = ? WHERE cocktail_id = ?',
            [glassware_id, cocktail_id],
            function (error, results) {
                if (error) throw error;
                res.send(results);
            });
    }
);

app.post('/api/cocktail/:cocktail_id/remove-glassware',
    (req, res) => {
        const {cocktail_id} = req.params;
        con.query('UPDATE cocktail SET glassware = NULL WHERE cocktail_id = ?',
            cocktail_id,
            function (error, results) {
                if (error) throw error;
                res.send(results);
            });
    }
);

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

app.delete('/api/bartender/:bartender_id',
    (req, res) => {
        const id = req.params.bartender_id;
        con.query('DELETE FROM bartender WHERE bartender_id = ?',
            id,
            function (error, results) {
                if (error) throw error;
                res.send(results);
            });
    });

app.delete('/api/cocktail/:cocktail_id',
    (req, res) => {
        const {cocktail_id} = req.params;
        con.query('CALL delete_cocktail(?)',
            cocktail_id,
            function (error, results) {
                if (error) throw error;
                res.send(results);
            });
    });

app.delete('/api/cocktail/:cocktail_id/remove-ingredient/:ingredient_id',
    (req, res) => {
        const {cocktail_id, ingredient_id} = req.params;
        con.query('DELETE FROM cocktail_ingredients WHERE cocktail = ? AND ingredient = ?',
            [cocktail_id, ingredient_id],
            function (error, results) {
                if (error) throw error;
                res.send(results);
            });
    });

app.delete('/api/cocktail/:cocktail_id/remove-garnish/:garnish_id',
    (req, res) => {
        const {cocktail_id, garnish_id} = req.params;
        con.query('DELETE FROM cocktail_garnishes WHERE cocktail = ? AND garnish = ?',
            [cocktail_id, garnish_id],
            function (error, results) {
                if (error) throw error;
                res.send(results);
            });
    });

app.delete('/api/cocktail/:cocktail_id/remove-step/:step_id',
    (req, res) => {
        const {cocktail_id, step_id} = req.params;
        con.query('DELETE FROM cocktail_steps WHERE cocktail = ? AND step = ?',
            [cocktail_id, step_id],
            function (error, results) {
                if (error) throw error;
                res.send(results);
            });
    });

app.listen(process.env.PORT || 8000, () => {
    console.log('Example app listening on port 8000!')
});