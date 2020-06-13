-- Drops pharmacies table
DROP TABLE IF EXISTS pharmacies;

-- Creates pharmacies table
CREATE TABLE IF NOT EXISTS pharmacies (
    id INT NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY
    , name varchar(50) NOT NULL
    , address varchar(50) NOT NULL
    , city varchar(50) NOT NULL
    , state varchar(10) NOT NULL 
    , zip varchar(10) NOT NULL
    , latitude decimal NOT NULL
    , longitude decimal NOT NULL
);
