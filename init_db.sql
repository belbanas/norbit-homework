DROP TABLE IF EXISTS "coordinates";
DROP TABLE IF EXISTS "tracks";

CREATE TABLE "tracks"(
    id              SERIAL PRIMARY KEY,
    client_id       VARCHAR(255) NOT NULL,
    start_record    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    stop_record     TIMESTAMP
);

CREATE TABLE "coordinates"(
    id              SERIAL PRIMARY KEY,
    track_id        INTEGER NOT NULL,
    date_created    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    latitude        FLOAT NOT NULL,
    longitude       FLOAT NOT NULL,
    heading         FLOAT NOT NULL,
    CONSTRAINT fk_tracks FOREIGN KEY (track_id) REFERENCES tracks(id)
);