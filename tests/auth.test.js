require("dotenv").config();

const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../app");

describe("Authentication and Permissions", () => {

    test("should reject access without token", async () => {

        const response = await request(app).get("/api/orders/me");

        expect(response.status).toBe(401);

    });

    test("should reject product creation by customer", async () => {

        const token = jwt.sign(
            {
                id: "507f1f77bcf86cd799439011",
                role: "customer"
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1h"
            }
        );

        const response = await request(app)
            .post("/api/products")
            .set("Authorization", "Bearer " + token)
            .send({
                name: "Test Product",
                priceCents: 2500
            });

        expect(response.status).toBe(403);

    });

});