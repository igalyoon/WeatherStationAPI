import request from "supertest";
import app from "../src/app";
import WeatherStation from "../src/models/weatherStation";

beforeEach(async () => {
    // Clear the database before each test
    await WeatherStation.deleteMany({});
});

describe("Weather Station API", () => {
    test("POST /report", async () => {
        const response = await request(app)
            .post("/report")
            .send({stationId: "station1", temperature: 25});

        expect(response.status).toBe(200);
        expect(response.body.stationId).toEqual("station1");
        expect(response.body.temperatures[0].temperature).toEqual(25);
    });

    test("GET /logs/:stationId", async () => {
        const stationId = "station2";

        await WeatherStation.create({
            stationId,
            city: "Test City",
            temperatures: [{timestamp: new Date(), temperature: 30}],
        });

        const response = await request(app)
            .get(`/logs/${stationId}`);

        expect(response.status).toBe(200);
        expect(response.body[0].temperature).toEqual(30);
    });

    test("DELETE /logs/:stationId", async () => {
        const stationId = "station3";

        await WeatherStation.create({
            stationId,
            city: "Test City",
            temperatures: [{timestamp: new Date(), temperature: 28}],
        });

        const response = await request(app)
            .delete(`/logs/${stationId}`);

        expect(response.status).toBe(200);
        expect(response.body.message).toEqual("Temperature log deleted successfully");
    });

    test("GET /stats/:stationId", async () => {
        const stationId = "station4";

        await WeatherStation.create({
            stationId,
            city: "Test City",
            temperatures: [
                {timestamp: new Date(), temperature: 28},
                {timestamp: new Date(), temperature: 30},
            ],
        });

        const response = await request(app)
            .get(`/stats/${stationId}`);

        expect(response.status).toBe(200);
        expect(response.body.average).toEqual(29);
        expect(response.body.min).toEqual(28);
        expect(response.body.max).toEqual(30);
        expect(response.body.median).toEqual(29);
    });

    test("GET /stats/:stationId/:startDate/:endDate", async () => {
        const stationId = "station5";
        const startDate = "2023-01-01";
        const endDate = "2023-01-02";

        await WeatherStation.create({
            stationId,
            city: "Test City",
            temperatures: [
                {timestamp: new Date("2023-01-01T10:00:00"), temperature: 28},
                {timestamp: new Date("2023-01-01T12:00:00"), temperature: 30},
            ],
        });

        const response = await request(app)
            .get(`/stats/${stationId}/${startDate}/${endDate}`);
        expect(response.status).toBe(200);
        expect(response.body.average).toEqual(29);
        expect(response.body.min).toEqual(28);
        expect(response.body.max).toEqual(30);
        expect(response.body.median).toEqual(29);
    });

    test("Rate Limit - POST /report", async () => {
        const stationId = "station6";
        await WeatherStation.create({
            stationId,
            city: "Test City",
            temperatures: [{timestamp: new Date(), temperature: 25}],
        });

        const response = await request(app)
            .post("/report")
            .send({stationId, temperature: 26});

        expect(response.status).toBe(429);
        expect(response.body.error).toEqual("You can only report a temperature once a minute");
    });

    test("Error - POST /report without stationId", async () => {
        const response = await request(app)
            .post("/report")
            .send({temperature: 25});
        expect(response.status).toBe(400);
        expect(response.body.error).toEqual("stationId is required");
    });
});
