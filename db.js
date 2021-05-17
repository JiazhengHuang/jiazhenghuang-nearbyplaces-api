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

let getPlaces = () => {
    let sql = `select p.name, a.street, a.city, a.state, a.postalcode,
  json_agg(json_build_object('comment', r."comment", 'rating', r.rating)) as reviews
  from mynearbyplaces.place p
  inner join mynearbyplaces.address a on p.addressid = a.id
  left join mynearbyplaces.review r on p.id = r.placeid
  where p.name like '%%' and a.street like '%%'
  group by p.name, a.street, a.city, a.state, a.postalcode`;
    console.log(sql);
    return pool.query(sql).then((result) => result.rows);
};

let getIdByName = (placeName) => {
    return pool
        .query("select id from mynearbyplaces.place where like %$1%", [
            placeName,
        ])
        .then((result) => {
            return result.rows;
        });
};

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

let saveReview = (comment, rating, placeid) => {
    return pool
        .query(
            "insert into mynearbyplaces.review(comment, rating, placeid) values ($1, $2, $3)",
            [comment, rating, placeid]
        )
        .then(() => console.log("the review was saved"));
};

let findPlaces = (placeName, street, city, state, postalcode) => {
    let sql = `select p.name, a.street, a.city, a.state, a.postalcode,
    json_agg(json_build_object('comment', r.comment, 'rating', r.rating)) as reviews
    from mynearbyplaces.place p
    inner join mynearbyplaces.address a on p.addressid = a.id
    left join mynearbyplaces.review r on p.id = r.placeid
    where 
    (p.name like '${
        !placeName ? "%%" : `%${placeName}%`
    }') and (a.street like '${!street ? "%%" : `%${street}%`}')
    and (a.city like '${!city ? "%%" : `%${city}%`}') and (a.state like '${
        !state ? "%%" : `%${state}%`
    }') 
    and (cast(a.postalcode as text) like '${
        !postalcode ? "%%" : `%${postalcode}%`
    }')
    group by p.name, a.street, a.city, a.state, a.postalcode
    `;
    console.log(sql);
    return pool.query(sql).then((result) => result.rows);
};

module.exports = {
    saveAddress,
    savePlace,
    findPlaces,
    getPlaces,
    saveReview,
    getIdByName,
};
