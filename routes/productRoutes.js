const express = require("express") ;
const router = express.Router() ;


const {createProduct, getProduct , getProductById, updateProduct} = require("../controllers/productController");

const authenticateToken = require("../middlewares/authenticateToken");
const authorizeRole = require("../middlewares/authorizeRole");


router.post("/", authenticateToken , authorizeRole("seller"),createProduct) ;
router.get("/",getProduct) ;
router.get("/:id",getProductById);
router.patch("/:id",authenticateToken , authorizeRole("seller"),updateProduct) ;




module.exports = router ;