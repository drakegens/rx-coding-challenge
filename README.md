# RX Coding Challenge

## Prerequisites:

- node (I'm using 10.16.3)
- docker (I'm using 19.03.8)

## Get it running

1. `cd server && npm i && cd ..`
1. `docker run -d --name pharm_db -p 5432:5432 -e 'POSTGRES_PASSWORD=postgres' postgres`
1. `cd server && npm run initdb && cd ..`
1. `cd server && npm run import-csv && cd ..`
1. `cd server && npm run start`

## Testing

I didn't set up any formal test infrastructure, but I placed a test script in `src/tools/test` that can be run with `npm run test`

I also used Postman for testing.
