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
    let name = request.body.name;
    let street = request.body.street;
    let city = request.body.city;
    let state = request.body.state;
    let postalcode = request.body.postalcode;

    db.saveAddress(street, city, state, postalcode)
        .then((addressid) => db.savePlace(name, addressid))
        .then(() => response.send(`The place ${name} was added successfully.`))
        .catch((e) =>
            response.status(500).send("There was an error in saving the place")
        );
});

// //adds a review to the place whose name is equal to the 'placeName' parameter.
// app.post("/review/:placeName", (request, response) => {
//     let placeName = request.query.placeName;
//     let comment = request.body.comment;
//     let rating = request.body.rating;
//     let placeid = db.getIdByName(placeName);

//     db.saveReview(comment, rating, placeid)
//         .then(() =>
//             response.send(`The review for ${placeName} was added successfully.`)
//         )
//         .catch((e) =>
//             response.status(500).send("There was an error in saving the place")
//         );
// });

//retrieves the list of all the places from the database
app.get("/places", (request, response) => {
    db.getPlaces()
        .then((places) => response.json(places))
        .catch((e) => {
            console.log(e);
            response
                .status(500)
                .send("There was an error in finding the places.");
        });
});

//returning the result of the search query.
app.get(
    "/search/:placeName?/:street?/:city?/:state?/:postalcode?",
    (request, response) => {
        let placeName = request.query.placeName;
        let street = request.query.street;
        let city = request.query.city;
        let state = request.query.state;
        let postalcode = request.query.postalcode;
        console.log(`name: ${placeName} - ${typeof placeName}`);
        console.log(`street: ${street} - ${typeof street}`);
        db.findPlaces(placeName, street, city, state, postalcode)
            .then((places) => response.json(places))
            .catch((e) => {
                console.log(e);
                response
                    .status(500)
                    .send("There was an error in finding the places.");
            });
    }
);

app.listen(port, () => console.log("Listening on port " + port));
