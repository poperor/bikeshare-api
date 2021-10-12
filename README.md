# Bikeshare-api
Api for showing availability of bikes at stations in a bikeshare system based on General Bikeshare Feed Specification.

The app is built in Node and Express using Axios to perform api calls to Oslo's bikeshare api

No api key is used since Oslo's bikeshare API seems to be open anyway and I found no way to register, but a 'client-name' header is provided with each request to the api.

### Requirements 
node 8.x or higher

### Tests
Tests are written with supertest and mocha - API calls are mocked using nock.

### Config
The api auto discovery url and the client-name header can if desired be configured in ~/src/config.js before the app is built.

### Install
clone the repository

navigate to the top folder of the app

npm install

npm run build

### Running tests
npm test

### Usage
npm start

The api endpoint will then be available on http://localhost:3000/availability

