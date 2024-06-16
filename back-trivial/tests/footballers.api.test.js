const request = require("supertest");
const {app, server} = require('../app');
const api = request(app);

//it changes everytime you log, this is for me the last time i logged
const token = "cce591040984e060f9ddbb47c6e5481e";
const token_secret = "f1dedf0aab8c07cc1feccc72d12da8b9d2125f75";


describe("api footballers tests", () => {


    describe("get footballers", () => {
      test("get footballers by height", async () => {
        await api.get("/footballers/P2048").expect(200);
      }, 60000);

      test("get footballers by position", async () => {
        await api.get("/footballers/P413").expect(200);
      }, 60000);

      test("get footballers by goals", async () => {
        await api.get("/footballers/P6509").expect(200);
      }, 60000);
    });


    describe("save footballers", () => {
      test("save footballer ok", async () => {
        //the id its for the wikidata sandbox, where you can put whatever you want, its for tests 
        //https://www.wikidata.org/wiki/Q4115189
        const data = {
          "footballerId": "Q4115189",
          "property": "P2048",
          "value": "177",
          "referenceURL": "https://example.com",
          "token": token,
          "token_secret": token_secret
        };

        const response = await api.post("/footballers").send(data);
    
        expect(response.status).toBe(200);

      }, 60000);
    });


    afterAll(() => {
        server.close();
      });
});