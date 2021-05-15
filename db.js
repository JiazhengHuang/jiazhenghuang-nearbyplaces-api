require("dotenv").config();
const { Pool } = require("pg");

let host = process.env.host;
let database = process.env.database;
let port = process.env.port;
let username = process.env.username;
let password = process.env.password;

let connectionString = `postgres://${username}:${password}@${host}:${port}/${database}`;

let connection = {
    connectionString: process.env.DATABASE_URL
        ? process.env.DATABASE_URL
        : connectionString,
    ssl: { rejectUnauthorized: false },
};

const pool = new Pool(connection);

let saveAddress = (street, city, state, postalcode) => {
    return pool
        .query(
            "insert into mynearbyplaces.address(street, city, state, postalcode) values ($1, $2, $3, $4) returning id",
            [street, city, state, postalcode]
        )
        .then((result) => {
            console.log("the address was saved");
            return result.rows[0].id;
        });
};

let savePlace = (name, addressid) => {
    return pool
        .query(
            "insert into mynearbyplaces.place(name, addressid) values ($1, $2)",
            [name, addressid]
        )
        .then(() => console.log("the palce was saved"));
};

module.exports = { saveAddress, savePlace };
