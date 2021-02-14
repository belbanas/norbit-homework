DROP TABLE IF EXISTS "coordinates";
DROP TABLE IF EXISTS "tracks";

CREATE TABLE "tracks"(
    id              SERIAL PRIMARY KEY,
    client_id       VARCHAR(255) NOT NULL,
    start_record    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    stop_record     TIMESTAMP
);
