-- Drops guitars table
DROP TABLE IF EXISTS pharmacies;

-- Creates guitars table
CREATE TABLE IF NOT EXISTS pharmacies (
    id INT NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY
    , name varchar(50) NOT NULL
    , address varchar(50) NOT NULL
    , city varchar(50) NOT NULL
    , state varchar(10) NULL 
    , zip varchar(10) NULL
    , latitude varchar(50) NULL
    , longitude varchar(50) NULL
);
