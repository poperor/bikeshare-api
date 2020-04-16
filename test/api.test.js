import request from "supertest";
import api from "../src/api.js";
import nock from "nock";
import config from "../src/config";
import gbfs from "../__fixtures__/gbfs";
import stationInformation from "../__fixtures__/station_information";
import stationStatus from "../__fixtures__/station_status";
import { assert } from "chai";
const expectedResult = {
  stations: [
    { id: "611", name: "Bankplassen", numBikes: 12, numDocks: 27 },
    { id: "579", name: "Bogstadveien", numBikes: 0, numDocks: 17 },
    { id: "404", name: "Oslo Handelsgymnasium", numBikes: 8, numDocks: 19 },
  ],
};

it("correct json is returned", async () => {
  // mocks axios calls to gbfs api with nock
  nock(config.gbfsUrl).get(config.gbfsPath).reply(200, gbfs);
  nock("http://gbfs.urbansharing.com/")
    .get("/oslobysykkel.no/station_information.json")
    .reply(200, stationInformation);
  nock("http://gbfs.urbansharing.com/")
    .get("/oslobysykkel.no/station_status.json")
    .reply(200, stationStatus);
  await request(api)
    .get("/availability")
    .expect("Content-Type", /json/)
    .expect(200)
    .expect(expectedResult);
});

it("404 is handled", async () => {
  const res = await request(api)
    .get("/wrongpath")
    .expect("Content-Type", /json/)
    .expect(404);
  assert(
    res.body.message.includes("wrongpath does not exist"),
    "error message is correct"
  );
  assert(res.body.statusCode === 404, "status code 404");
});

it("500 is handled", async () => {
  // provoke exception by giving wrong path to axios call with nock
  nock(config.gbfsUrl).get("/wrongpath").reply(200, gbfs);
  const res = await request(api)
    .get("/availability")
    .expect("Content-Type", /json/)
    .expect(500);
  assert(res.body.message === "server error", "error message is correct");
  assert(res.body.statusCode === 500, "status code 500");
});
