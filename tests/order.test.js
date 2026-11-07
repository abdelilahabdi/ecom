require("dotenv").config({ quiet: true });

const request = require("supertest");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const app = require("../app");

const Product = require("../models/Product");
const Order = require("../models/Order");

// Give tests more time
jest.setTimeout(20000);

describe("Orders API", () => {

    let customerToken;
    let otherCustomerToken;

    // Connect to test database
    beforeAll(async () => {

        const testUri = process.env.TEST_MONGO_URI;

        // Check test database
        if (testUri !== "mongodb://127.0.0.1:27017/ecom_br_test") {
            throw new Error("Invalid test database");
        }

        // Connect MongoDB
        await mongoose.connect(testUri, {
            serverSelectionTimeoutMS: 8000,
            runtimeAdapters: {
                os: require("os")
            }
        });

        // Check database name
        if (mongoose.connection.name !== "ecom_br_test") {
            await mongoose.disconnect();
            throw new Error("Wrong database");
        }

        console.log("Test database connected");

        // Create two customer IDs
        const customerId = new mongoose.Types.ObjectId();
        const otherCustomerId = new mongoose.Types.ObjectId();

        // Create first customer token
        customerToken = jwt.sign(
            {
                id: customerId.toString(),
                role: "customer"
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1h"
            }
        );

        // Create second customer token
        otherCustomerToken = jwt.sign(
            {
                id: otherCustomerId.toString(),
                role: "customer"
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1h"
            }
        );

        // Clean test database
        await Order.deleteMany({});
        await Product.deleteMany({});

    });


    // Clean data after each test
    afterEach(async () => {

        if (
            mongoose.connection.readyState === 1 &&
            mongoose.connection.name === "ecom_br_test"
        ) {
            await Order.deleteMany({});
            await Product.deleteMany({});
        }

    });


    // Disconnect MongoDB
    afterAll(async () => {

        if (mongoose.connection.readyState !== 0) {
            await mongoose.disconnect();
        }

    });


    // TEST 1: Calculate order using database price
    test("should calculate order using database price", async () => {

        const product = await Product.create({
            name: "Clavier",
            priceCents: 2500
        });

        const response = await request(app)
            .post("/api/orders")
            .set("Authorization", "Bearer " + customerToken)
            .send({
                items: [
                    {
                        productId: product._id.toString(),
                        quantity: 2
                    }
                ],
                totalCents: 1
            });

        expect(response.status).toBe(201);

        expect(response.body.order.totalCents).toBe(5000);

        expect(response.body.order.status).toBe("new");

    });


    // TEST 2: Customer cannot access another customer order
    test("should reject access to another customer order", async () => {

        const product = await Product.create({
            name: "Souris",
            priceCents: 1000
        });

        // First customer creates order
        const created = await request(app)
            .post("/api/orders")
            .set("Authorization", "Bearer " + customerToken)
            .send({
                items: [
                    {
                        productId: product._id.toString(),
                        quantity: 1
                    }
                ]
            });

        expect(created.status).toBe(201);

        const orderId = created.body.order._id;

        // Second customer tries to access order
        const response = await request(app)
            .get("/api/orders/" + orderId)
            .set("Authorization", "Bearer " + otherCustomerToken);

        expect(response.status).toBe(403);

    });


    // TEST 3: Reject unavailable product
    test("should reject unavailable product", async () => {

        const product1 = await Product.create({
            name: "Clavier",
            priceCents: 2500,
            available: true
        });

        const product2 = await Product.create({
            name: "Souris",
            priceCents: 1000,
            available: false
        });

        const response = await request(app)
            .post("/api/orders")
            .set("Authorization", "Bearer " + customerToken)
            .send({
                items: [
                    {
                        productId: product1._id.toString(),
                        quantity: 1
                    },
                    {
                        productId: product2._id.toString(),
                        quantity: 1
                    }
                ]
            });

        expect(response.status).toBe(409);

        // Check that no order was saved
        const count = await Order.countDocuments();

        expect(count).toBe(0);

    });


    // TEST 4: Keep original price after product update
    test("should keep old price after product update", async () => {

        const product = await Product.create({
            name: "Clavier",
            priceCents: 2500
        });

        // Create order
        const created = await request(app)
            .post("/api/orders")
            .set("Authorization", "Bearer " + customerToken)
            .send({
                items: [
                    {
                        productId: product._id.toString(),
                        quantity: 2
                    }
                ]
            });

        expect(created.status).toBe(201);

        const orderId = created.body.order._id;

        // Change product price
        product.priceCents = 7000;

        await product.save();

        // Get old order
        const response = await request(app)
            .get("/api/orders/" + orderId)
            .set("Authorization", "Bearer " + customerToken);

        expect(response.status).toBe(200);

        // Old order must keep original price
        expect(response.body.order.totalCents).toBe(5000);

        expect(response.body.order.items[0].unitPriceCents).toBe(2500);

    });

});