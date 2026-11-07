PRAGMA foreign_keys = ON;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    role TEXT NOT NULL CHECK (role IN ('customer', 'seller'))
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    price_cents INTEGER NOT NULL CHECK (
        typeof(price_cents) = 'integer' AND price_cents > 0
    ),
    available INTEGER NOT NULL DEFAULT 1 CHECK (available IN (0, 1))
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    client_id INTEGER NOT NULL,
    total_cents INTEGER NOT NULL CHECK (
        typeof(total_cents) = 'integer' AND total_cents > 0
    ),
    status TEXT NOT NULL DEFAULT 'new'
        CHECK (status IN ('new', 'processed')),

        customerNote TEXT,

        
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (client_id) REFERENCES users(id)
);

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    quantity INTEGER NOT NULL CHECK (
        typeof(quantity) = 'integer' AND quantity BETWEEN 1 AND 10
    ),
    unit_price_cents INTEGER NOT NULL CHECK (
        typeof(unit_price_cents) = 'integer' AND unit_price_cents > 0
    ),

    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES products(id),
    UNIQUE (order_id, product_id)
);