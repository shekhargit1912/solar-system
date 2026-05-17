const path = require('path');
const express = require('express');
const OS = require('os');
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const app = express();
const cors = require('cors')

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '/')));
app.use(cors())

// Mock planet data for testing
const mockPlanets = [
    { id: 1, name: 'Mercury', description: '', image: '', velocity: '', distance: '' },
    { id: 2, name: 'Venus', description: '', image: '', velocity: '', distance: '' },
    { id: 3, name: 'Earth', description: '', image: '', velocity: '', distance: '' },
    { id: 4, name: 'Mars', description: '', image: '', velocity: '', distance: '' },
    { id: 5, name: 'Jupiter', description: '', image: '', velocity: '', distance: '' },
    { id: 6, name: 'Saturn', description: '', image: '', velocity: '', distance: '' },
    { id: 7, name: 'Uranus', description: '', image: '', velocity: '', distance: '' },
    { id: 8, name: 'Neptune', description: '', image: '', velocity: '', distance: '' }
];

// Only connect to MongoDB if MONGO_URI is provided
if (process.env.MONGO_URI) {
    mongoose.connect(process.env.MONGO_URI, {
        user: process.env.MONGO_USERNAME,
        pass: process.env.MONGO_PASSWORD,
        useNewUrlParser: true,
        useUnifiedTopology: true
    }, function(err) {
        if (err) {
            console.log("error!! " + err)
        }
    })
}

var Schema = mongoose.Schema;

var dataSchema = new Schema({
    name: String,
    id: Number,
    description: String,
    image: String,
    velocity: String,
    distance: String
});
var planetModel = mongoose.model('planets', dataSchema);

app.post('/planet', function(req, res) {
    // Use mock data if no database connection, otherwise query DB
    if (process.env.MONGO_URI) {
        planetModel.findOne({
            id: req.body.id
        }, function(err, planetData) {
            if (err) {
                res.status(500).send("Error in Planet Data")
            } else {
                res.send(planetData);
            }
        })
    } else {
        // Return mock data for tests
        const planet = mockPlanets.find(p => p.id === req.body.id);
        if (planet) {
            res.send(planet);
        } else {
            res.status(404).send("Planet not found");
        }
    }
})

app.get('/', async (req, res) => {
    res.sendFile(path.join(__dirname, '/', 'index.html'));
});

app.get('/os', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send({
        "os": OS.hostname(),
        "env": process.env.NODE_ENV
    });
})

app.get('/live', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send({
        "status": "live"
    });
})

app.get('/ready', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send({
        "status": "ready"
    });
})

app.listen(3000, () => {
    console.log("Server successfully running on port - " + 3000);
})

module.exports = app;