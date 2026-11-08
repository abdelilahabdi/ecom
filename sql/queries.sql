-- 1. Get available products

SELECT *
FROM products
WHERE available = 1;


-- 2. Get orders of one customer

SELECT *
FROM orders
WHERE client_id = 2;


-- 3. Get order details with products

SELECT
    orders.id AS order_id,
    products.name AS product_name,
    order_items.name AS purchased_name,
    order_items.quantity,
    order_items.unit_price_cents

FROM orders

JOIN order_items
ON orders.id = order_items.order_id

JOIN products
ON order_items.product_id = products.id

WHERE orders.id = 1;


-- 4. Calculate order total

SELECT
    orders.id AS order_id,
    SUM(order_items.quantity * order_items.unit_price_cents) AS total_cents

FROM orders

JOIN order_items
ON orders.id = order_items.order_id

GROUP BY orders.id;