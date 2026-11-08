require("dotenv").config({ quiet: true });

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const User = require("./models/User");
const Product = require("./models/Product");

const seedDatabase = async () => {

    try {

        // Get passwords and email from .env
        const sellerEmail = process.env.SEED_SELLER_EMAIL;
        const sellerPassword = process.env.SEED_SELLER_PASSWORD;
        const customerPassword = process.env.SEED_CUSTOMER_PASSWORD;

        // Check environment variables
        if (!process.env.MONGODB_URI || !sellerEmail || !sellerPassword || !customerPassword) {
            throw new Error("Missing environment variables");
        }

        if (sellerPassword.length < 8 || customerPassword.length < 8) {
            throw new Error("Passwords must have at least 8 characters");
        }

        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);

        // Check database
        if (mongoose.connection.name !== "ecom_br") {
            throw new Error("Wrong database");
        }

        console.log("MongoDB connected");

        // Demo users
        const users = [
            {
                name: "Seller Demo",
                email: sellerEmail,
                password: sellerPassword,
                role: "seller"
            },
            {
                name: "Client 1",
                email: "client1.demo@example.com",
                password: customerPassword,
                role: "customer"
            },
            {
                name: "Client 2",
                email: "client2.demo@example.com",
                password: customerPassword,
                role: "customer"
            }
        ];

        // Create users
        for (const user of users) {

            const existingUser = await User.findOne({
                email: user.email.toLowerCase().trim()
            });

            if (!existingUser) {

                const passwordHash = await bcrypt.hash(user.password, 10);

                await User.create({
                    name: user.name,
                    email: user.email,
                    passwordHash: passwordHash,
                    role: user.role
                });

                console.log("User created:", user.email);

            } else {

                console.log("User already exists:", user.email);

            }
        }

        // Demo products
        const products = [
            {
                name: "Demo Clavier",
                priceCents: 2500,
                available: true
            },
            {
                name: "Demo Souris",
                priceCents: 1000,
                available: true
            },
            {
                name: "Demo Casque",
                priceCents: 1500,
                available: true
            },
            {
                name: "Demo Ecran",
                priceCents: 15000,
                available: true
            },
            {
                name: "Demo Webcam",
                priceCents: 3500,
                available: false
            }
        ];

        // Create products
        for (const product of products) {

            const existingProduct = await Product.findOne({
                name: product.name
            });

            if (!existingProduct) {

                await Product.create(product);

                console.log("Product created:", product.name);

            } else {

                console.log("Product already exists:", product.name);

            }
        }

        console.log("Seed completed successfully");

    } catch (error) {

        console.log("Seed error:", error.message);
        process.exitCode = 1;

    } finally {

        await mongoose.disconnect();

    }
};

seedDatabase();