const { DatabaseSync } = require("node:sqlite");
const path = require("path");
const fs = require("fs");

// Get customer ID
const clientId = Number(process.argv[2]);

// Check customer ID
if (!Number.isInteger(clientId) || clientId <= 0) {
    console.log("Invalid customer ID");
    process.exit(1);
}

// Database path
const dbPath = path.join(__dirname, "boutique.db");

// Check database exists
if (!fs.existsSync(dbPath)) {
    console.log("Database not found");
    process.exit(1);
}

// Connect to SQLite
const db = new DatabaseSync(dbPath);

try {

    // SQL query
    const sql = "SELECT * FROM orders WHERE client_id = ?";

    // Prepare query
    const query = db.prepare(sql);

    // Get customer orders
    const orders = query.all(clientId);

    // Display results
    console.table(orders);

} catch (error) {

    console.log("Error:", error.message);

} finally {

    // Close database
    db.close();

}