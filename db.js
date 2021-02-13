const { Pool } = require("pg");
const fs = require("fs");

let database;
let filename = "./database.json";

try {
    const data = fs.readFileSync(filename, "utf8");
    database = JSON.parse(data);
} catch (e) {
    console.log(e);
}

const pool = new Pool(database);

module.exports = {
    query: (text, params, callback) => {
        return pool.query(text, params, callback);
    },
};
