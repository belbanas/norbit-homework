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

async function getPointsForTrack(id) {
    let res;
    try {
        res = await db.query("SELECT * FROM coordinates WHERE track_id = $1", [
            id,
        ]);
    } catch (err) {
        console.log(err);
    }
    return res.rows;
}

module.exports.viewTracks = viewTracks;
module.exports.getPointsForTrack = getPointsForTrack;
