const request = require("supertest");
const {app, server} = require('../app');
const api = request(app);

//it changes everytime you log, this is for me the last time i logged
const token = "cce591040984e060f9ddbb47c6e5481e";
const token_secret = "f1dedf0aab8c07cc1feccc72d12da8b9d2125f75";


describe("api researchers tests", () => { 

    //this tests can fail due to timeout of the query
    describe("get researchers", () => {
      test("get researchers by alma mater", async () => {
        await api.get("/researchers/P69").expect(200);
      }, 60000);

      test("get researchers by place of birth", async () => {
        await api.get("/researchers/P19").expect(200);
      }, 60000);
    });


    describe("save researcher", () => {
      test("save researcher alma mater ok", async () => {
        //the id its for the wikidata sandbox, where you can put whatever you want, its for tests 
        //https://www.wikidata.org/wiki/Q4115189
        const data = {
          "researcherId": "Q4115189",
          "property": "P69",
          "value": "Q49123",
          "referenceURL": "https://example.com",
          "token": token,
          "token_secret": token_secret
        };

        const response = await api.post("/researchers").send(data);
    
        expect(response.status).toBe(200);

      }, 60000);


      test("save researcher place of birth ok", async () => {
        const data = {
          "researcherId": "Q4115189",
          "property": "P19",
          "value": "Q2807",
          "referenceURL": "https://example.com",
          "token": token,
          "token_secret": token_secret
        };

        const response = await api.post("/researchers").send(data);
    
        expect(response.status).toBe(200);

      }, 60000);

      test("save researcher invalids args", async () => {
        const data = {
          "researcherId": "Q4115189",
          "property": "P69",
          "value": "Universidad de Oviedo",
          "referenceURL": "invalidscheme",
          "token": token,
          "token_secret": token_secret
        };

        const response = await api.post("/researchers").send(data);
    
        expect(response.status).toBe(500);

      }, 60000);
    });


    afterAll(() => {
        server.close();
      });
});