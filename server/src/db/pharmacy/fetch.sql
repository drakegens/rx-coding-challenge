SELECT name, address, city, state, zip, latitude, longitude
FROM pharmacies
WHERE id = :id;
