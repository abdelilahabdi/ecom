require("dotenv").config();

const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../app");
const Product = require("../models/Product");

describe("Products API", () => {

    beforeAll(async () => {

        const testUri = process.env.TEST_MONGO_URI;

        if (testUri !== "mongodb://127.0.0.1:27017/ecom_br_test") {
            throw new Error("Invalid test database URI");
        }

        await mongoose.connect(testUri, {
            serverSelectionTimeoutMS: 10000,
            runtimeAdapters: {
                os: require("os")
            }
        });

        if (mongoose.connection.name !== "ecom_br_test") {
            await mongoose.disconnect();
            throw new Error("Unexpected test database");
        }

        console.log("Test database connected");

    });

    afterEach(async () => {

        if (
            mongoose.connection.readyState === 1 &&
            mongoose.connection.name === "ecom_br_test"
        ) {
            await Product.deleteMany({});
        }

    });

    afterAll(async () => {

        await mongoose.disconnect();

    });

    test("should return all products", async () => {

        await Product.create({
            name: "Test Product",
            priceCents: 2500
        });

        const response = await request(app).get("/api/products");

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body).toHaveLength(1);
        expect(response.body[0].name).toBe("Test Product");

    });

});