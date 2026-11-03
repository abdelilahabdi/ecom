const express = require("express");
const router = express.Router() ;


const {createOrder , getMyOrders , getAllOrders , getOrderById , processOrder} = require ("../controllers/orderController");
const authenticateToken = require("../middlewares/authenticateToken");
const authorizeRole = require("../middlewares/authorizeRole");

router.get("/me", authenticateToken , getMyOrders);
router.post("/",authenticateToken , createOrder );
router.get("/", authenticateToken , authorizeRole ("seller"), getAllOrders) ;
router.get("/:id", authenticateToken , getOrderById);  
router.patch("/:id/status", authenticateToken , authorizeRole("seller") , processOrder) ;
module.exports = router ; 