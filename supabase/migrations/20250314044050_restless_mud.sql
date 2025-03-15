-- users table
CREATE TABLE users (
                       uid                SERIAL PRIMARY KEY,
                       username           TEXT NOT NULL UNIQUE,          -- Username
                       passwd             TEXT NOT NULL,                 -- Encrypted password
                       email              TEXT,
                       gender             TEXT,
                       fullname           TEXT,
                       travel_preferences TEXT,
                       item_like          TEXT,                          -- Newly added: Items liked/commonly brought by users (JSON format)
                       created_at         TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                       updated_at         TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- trips table
CREATE TABLE trips (
                       uid             SERIAL PRIMARY KEY,
                       username        INT NOT NULL,                      -- Reference to users(uid)
                       trip_name       TEXT NOT NULL,                     -- Trip name
                       destination     TEXT NOT NULL,                     -- Destination
                       start_date      DATE NOT NULL,
                       end_date        DATE NOT NULL,
                       women           TEXT,
                       men             TEXT,
                       children        TEXT,
                       climate_data    TEXT NOT NULL,                     -- Weather information retrieved from frontend
                       packing_list    TEXT,                              -- AI-generated or custom packing list
                       created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                       updated_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Foreign key constraint for trips.username
ALTER TABLE trips
    ADD CONSTRAINT fk_trips_user
        FOREIGN KEY (username)
            REFERENCES users(uid)
            ON DELETE CASCADE;
