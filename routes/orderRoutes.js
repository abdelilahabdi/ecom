const express = require("express");
const router = express.Router() ;


const {createOrder} = require ("../controllers/orderController");
const authenticateToken = require("../middlewares/authenticateToken");

router.post("/",authenticateToken , createOrder);

module.exports = router ;