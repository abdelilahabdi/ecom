PRAGMA foreign_keys = ON;

BEGIN TRANSACTION;

-- Users
INSERT OR IGNORE INTO users (id, name, email, role)
VALUES (1, 'Seller Demo', 'seller@example.com', 'seller');

INSERT OR IGNORE INTO users (id, name, email, role)
VALUES (2, 'Client 1', 'client1@example.com', 'customer');

INSERT OR IGNORE INTO users (id, name, email, role)
VALUES (3, 'Client 2', 'client2@example.com', 'customer');


-- Products
INSERT OR IGNORE INTO products (id, name, price_cents, available)
VALUES (1, 'Clavier', 2500, 1);

INSERT OR IGNORE INTO products (id, name, price_cents, available)
VALUES (2, 'Souris', 1000, 1);

INSERT OR IGNORE INTO products (id, name, price_cents, available)
VALUES (3, 'Casque', 1500, 0);


-- Orders
INSERT OR IGNORE INTO orders (id, client_id, total_cents, status)
VALUES (1, 2, 6000, 'new');

INSERT OR IGNORE INTO orders (id, client_id, total_cents, status)
VALUES (2, 3, 1500, 'processed');


-- Order Items
INSERT OR IGNORE INTO order_items
(id, order_id, product_id, name, quantity, unit_price_cents)
VALUES (1, 1, 1, 'Clavier', 2, 2500);

INSERT OR IGNORE INTO order_items
(id, order_id, product_id, name, quantity, unit_price_cents)
VALUES (2, 1, 2, 'Souris', 1, 1000);

INSERT OR IGNORE INTO order_items
(id, order_id, product_id, name, quantity, unit_price_cents)
VALUES (3, 2, 3, 'Casque', 1, 1500);

COMMIT;