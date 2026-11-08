
require("dotenv").config();

const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../app");
const Product = require("../models/Product");

describe("Health API", () => {
    test("should return status ok", async () => {
        const response = await request(app).get("/api/health");

        expect(response.status).toBe(200);
        expect(response.body.status).toBe("ok");
    });
});


