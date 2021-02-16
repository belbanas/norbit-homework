const db = require("./db.js");

async function viewTracks() {
    let res;
    try {
        res = await db.query("SELECT * FROM tracks", []);
    } catch (err) {
        console.log(err);
    }
    return res.rows;
}

module.exports.viewTracks = viewTracks;
