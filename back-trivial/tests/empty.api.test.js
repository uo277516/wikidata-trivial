const request = require("supertest");
const {app, server} = require('../app');
const api = request(app);


describe("empty properties tests", () => {


    describe("get empty properties", () => {
      test("get empty properties of an entity", async () => {
        ///properties/wd:${entity}/${encodedList}`);
        await api.get("/properties/wd:Q4115189/wdt:P264 wdt:P2048").expect(200);
      }, 60000);
    });


    afterAll(() => {
        server.close();
      });
});