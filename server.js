const cors = require("cors");
const { request, response } = require("express");
const db = require("./db");

// dependencies
const express = require("express");

// creat the server
const app = express();
const port = process.env.PORT || 4002;

// parse json
app.use(express.json());
app.use(cors());

//saves a new place into the database on the server.
app.post("/place", (request, response) => {
    response.send();
});

//retrieves the list of all the places from the database
app.get("/places", (request, response) => {
    response.json("Hello world!");
});

//adds a review to the place whose name is equal to the 'placeName' parameter.
app.post("/review/:placeName", (request, response) => {
    response.send();
});

//returning the result of the search query.
app.get("/search/:placeName/:location", (request, response) => {
    response.send();
});

app.listen(port, () => console.log("Listening on port " + port));
