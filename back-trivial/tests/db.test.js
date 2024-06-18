const request = require("supertest");
const {app, server} = require('../app');
const api = request(app);

describe("database tests (rankings)", () => {

    describe("get streaks", () => {
        test("get steaks by username", async () => {
            const response = await request(app).get("/getStreaks/Natalia Fernandez Riego");
            expect(response.status).toBe(200);       //loads ok
            expect(response.type).toMatch(/json/);   //its a json
            //the table has the properties
            expect(response.body[0].username).toBeDefined(); 
            expect(response.body[0].category).toBeDefined(); 
            expect(response.body[0].streak).toBeDefined(); 
            expect(response.body[0].date).toBeDefined();
        });

        test("get all streaks", async () => {
            const response = await request(app).get("/getAllStreaks");
            expect(response.status).toBe(200);       
            expect(response.type).toMatch(/json/);   
            //gets streaks and they are ordered
            const streaks = response.body;
            const first = response.body[0].streak;
            const last = response.body[streaks.length-1].streak;
            expect(first).toBeGreaterThan(last);
        });
    });

    describe("save streaks", () => {
        test("save a streak given the data", async () => {
            const streakData = {
                "username": "testuser",
                "category": "deporte",
                "streak": 10
            };
            await api.post("/saveStreak").send(streakData).expect(200);
        });
    });


    describe("save invalid streaks", () => {
        test("try to save a invalid streak (invalid category)", async () => {
            const streakData = {
                "username": "testuser",
                "category": "cine",
                "streak": 10
            };
            const response = await api.post("/saveStreak").send(streakData);
            expect(response.status).toBe(500);
            expect(response.text).toEqual(expect.stringContaining('Error saving streak: Invalid category'));
        });

        test("try to save a invalid streak (extra args)", async () => {
            const streakData = {
                "username": "testuser",
                "category": "cine",
                "streak": 10,
                "extraParam": "value" 
            };
            const response = await api.post("/saveStreak").send(streakData);
            expect(response.status).toBe(500);
            expect(response.text).toEqual(expect.stringContaining('Error saving streak: Incorrect number of parameters'));
        });
    });


    afterAll(() => {
        server.close();
      });
});