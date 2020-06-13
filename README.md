Prereqs: node, docker

1. In server -> npm i
1. docker run -d --name pharm_db -p 5432:5432 -e 'POSTGRES_PASSWORD=postgres' postgres
1. run the init db script
1. run the import csv script
