const calculateOrderTotal = (orderItems) => {

    if (!Array.isArray(orderItems) || orderItems.length < 1 || orderItems.length > 10) {
        throw new Error("Invalid order items");
    }

    let totalCents = 0;

    for (const item of orderItems) {

        if (!item) {
            throw new Error("Invalid order item");
        }

        const price = item.unitPriceCents;
        const quantity = item.quantity;

        // Check price
        if (!Number.isSafeInteger(price) || price <= 0) {
            throw new Error("Invalid price");
        }

        // Check quantity
        if (!Number.isInteger(quantity) || quantity < 1 || quantity > 10) {
            throw new Error("Invalid quantity");
        }

        // Calculate subtotal
        const subtotal = price * quantity;

        // Check subtotal
        if (!Number.isSafeInteger(subtotal)) {
            throw new Error("Order total exceeds safe integer limit");
        }

        // Add subtotal to total
        totalCents = totalCents + subtotal;

        // Check total
        if (!Number.isSafeInteger(totalCents)) {
            throw new Error("Order total exceeds safe integer limit");
        }
    }

    return totalCents;
};

module.exports = { calculateOrderTotal };