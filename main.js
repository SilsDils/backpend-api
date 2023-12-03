//This is the boilerplate code to write a simple web-server with the express.js framework
const express = require('express');
const db = require('mysql2');
const cors = require ('cors');

const app = express();
const port = 3002;

app.use (cors());
app.use(express.json());

const connection = db.createConnection({
    host: "localhost",
    user:"root",
    password:"Kfb5y9dt06h#",
    database:"backend_api_cafes"
});


// All cafes
app.get('/cafes',(req,res)=>{
    let allcafes = "SELECT * FROM cafes";
    const params = [];

// Search for specific city with query parameters
    if (req.query.city) {
        allcafes += ' WHERE city = ?';
        params.push(req.query.city);
    }

    connection.query(allcafes, params, (error, results) => {
        if (error) {
            res.status(500).send('Server error');
        } else {
            if (results.length === 0) {
                res.status(404).send("It seems that there are no cafes yet in this city");
            } else {
                res.json(results);
            }
        }
    });
});

// Search for cafe by id
app.get('/cafes/:id', (req, res) => {
    const cafeID = req.params.id;
    const query = "SELECT * FROM cafes WHERE cafe_id = ?";

    connection.query(query, [cafeID], (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).send('Server error');
        } else {
            if (results.length > 0) {
                res.json(results[0]);
            } else {
                res.status(404).send('Cafe not found');
            }
        }
    });
});


// Alle users
app.get('/users', (req, res) =>{
    const allusers = "SELECT * FROM users";
    connection.query(allusers, (error, result) =>{
        res.send(result);
    })
});

// Search for cafe by id
app.get('/users/:id', (req, res) => {
    const userID = req.params.id;
    const query = "SELECT * FROM users WHERE user_id = ?";

    connection.query(query, [userID], (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).send('Server error');
        } else {
            if (results.length > 0) {
                res.json(results[0]);
            } else {
                res.status(404).send('User not found');
            }
        }
    });
});



// POST new cafe
app.post ('/cafes', (req, res) => {
    const { name, address, city, wifi, quiet, good_coffee, cheap_food } = req.body;
    const query = 'INSERT INTO cafe (name, address, city, wifi, quiet, good_coffee, cheap_food) VALUES (?, ?, ?, ?, ?, ?, ?)';
    connection.query(query, [name, address, city, wifi, quiet, good_coffee, cheap_food], (error, result) => {
        if (error) {
            console.error(error);
            res.status(500).send("Error adding cafe");
        } else {
            res.status(201).send("Cafe added succesfully");
        }
    });
});

app.post('/users', (req, res) => {
    const { firstname, lastname, email, password } = req.body;
    const query = 'INSERT INTO users (firstname, lastname, email, password) VALUES (?, ?, ?, ?)';
    connection.query(query, [firstname, lastname, email, password], (error, result) => {
        if (error) {
            console.error(error);
            res.status(500).send("Error adding user");
        } else {
            res.status(201).send("User added succesfully");
        }
    });
});




app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
