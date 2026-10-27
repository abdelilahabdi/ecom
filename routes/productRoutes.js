const express = require("express") ;
const router = express.Router() ;


const {createProduct, getProduct} = require("../controllers/productController");

router.post("/",createProduct) ;
router.get("/",getProduct) ;


module.exports = router ;