const express = require("express");
const router = express.Router() ;


const {createOrder , getMyOrders} = require ("../controllers/orderController");
const authenticateToken = require("../middlewares/authenticateToken");

router.get("/me", authenticateToken , getMyOrders);
router.post("/",authenticateToken , createOrder );

module.exports = router ;