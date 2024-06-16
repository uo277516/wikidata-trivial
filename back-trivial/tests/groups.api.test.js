const request = require("supertest");
const {app, server} = require('../app');
const api = request(app);

//it changes everytime you log, this is for me the last time i logged
const token = "cce591040984e060f9ddbb47c6e5481e";
const token_secret = "f1dedf0aab8c07cc1feccc72d12da8b9d2125f75";


describe("api groups tests", () => {


    describe("get groups", () => {
      test("get groups by inception date", async () => {
        await api.get("/groups/P571").expect(200);
      }, 60000);

      test("get groups by discographic", async () => {
        await api.get("/groups/P264").expect(200);
      }, 60000);

    });


    describe("save groups", () => {
      test("save groups by inception date", async () => {
        //the id its for the wikidata sandbox, where you can put whatever you want, its for tests 
        //https://www.wikidata.org/wiki/Q4115189
        const data = {
          "groupId": "Q4115189",
          "property": "P571",
          "value": "1980",
          "referenceURL": "https://example.com",
          "token": token,
          "token_secret": token_secret
        };

        const response = await api.post("/groups").send(data);
    
        expect(response.status).toBe(200);

      }, 60000);


      test("save group by discographic", async () => {
        const data = {
          "footballerId": "Q4115189",
          "property": "P264",
          "value": "Q38903",
          "referenceURL": "https://example.com",
          "token": token,
          "token_secret": token_secret
        };

        const response = await api.post("/footballers").send(data);
    
        expect(response.status).toBe(200);

      }, 60000);


      test("invalid args", async () => {
        const data = {
          "footballerId": "Q4115189",
          "property": "P264",
          "value": "invalid disco",
          "referenceURL": "https://example.com",
          "token": token,
          "token_secret": token_secret
        };

        const response = await api.post("/footballers").send(data);
    
        expect(response.status).toBe(500);

      }, 60000);
    });


    afterAll(() => {
        server.close();
      });
});