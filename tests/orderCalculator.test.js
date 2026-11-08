const { calculateOrderTotal } = require("../services/orderCalculator");

describe("Order Calculator", () => {

    test("should calculate total for multiple products", () => {

        const items = [
            {
                unitPriceCents: 2500,
                quantity: 2
            },
            {
                unitPriceCents: 1000,
                quantity: 1
            }
        ];

        const total = calculateOrderTotal(items);

        expect(total).toBe(6000);
    });

    test("should reject invalid quantity", () => {

        const items = [
            {
                unitPriceCents: 2500,
                quantity: 0
            }
        ];

        expect(() => calculateOrderTotal(items)).toThrow(
            "Invalid quantity"
        );
    });

    test("should reject unsafe total", () => {

        const items = [
            {
                unitPriceCents: Number.MAX_SAFE_INTEGER,
                quantity: 2
            }
        ];

        expect(() => calculateOrderTotal(items)).toThrow(
            "Order total exceeds safe integer limit"
        );
    });

});