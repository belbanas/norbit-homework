const db = require("./db.js");
let lastTrackId;

const saveCoordinate = (lat, lon, head) => {
    db.query(
        "INSERT INTO coordinates(track_id, latitude, longitude, heading) VALUES($1, $2, $3, $4)",
        [lastTrackId, lat, lon, head],
        (err, res) => {
            if (err) {
                console.log("ERROR: " + err);
            } else {
                console.log("SAVED COORDINATE!");
            }
        }
    );
};

const saveTrack = (clientId) => {
    db.query(
        "INSERT INTO tracks(client_id) VALUES($1) RETURNING id",
        [clientId],
        (err, res) => {
            if (err) {
                console.log("ERROR: " + err);
            } else {
                console.log("START OK");
                lastTrackId = res.rows[0].id;
            }
        }
    );
};

const updateTrackStopTime = () => {
    db.query(
        "UPDATE tracks SET stop_record = CURRENT_TIMESTAMP WHERE id = $1",
        [lastTrackId],
        (err, res) => {
            if (err) {
                console.log("ERROR: " + err);
            } else {
                console.log("STOP OK");
            }
        }
    );
};

module.exports.saveCoordinate = saveCoordinate;
module.exports.saveTrack = saveTrack;
module.exports.updateTrackStopTime = updateTrackStopTime;
