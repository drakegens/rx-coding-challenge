INSERT INTO pharmacies (name, address, city, state, zip, latitude, longitude)
VALUES (:name, :address, :city, :state, :zip, :latitude, :longitude)
RETURNING id;
