const Product = require("../models/Product") ;

const createProduct = async (req,res) => {

    try {
        const product = await Product.create(req.body);

        res.status(201).json(product) ;
    } catch (error) {
        res.status(500).json({message : error.message}) ;
    }
}

const getProduct = async (req,res) => {
    try {
        const product = await Product.find() ;

        res.status(200).json(product) ;
    } catch (error) {
        res.status(500).json({message : error.message}) ;
    }
}


const getProductById = async (req,res) => {
    try {
        const product = await Product.findById(req.params.id);


        if(!product) {
            return res.status(404).json({
                message : "Product not found"
            });
        }

        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({message : error.message}) ;
    }
};


   const updateProduct = async (req , res) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new : true , runValidators : true}
        );


        if(!product){
            return res.status(404).json({
                message: "product not found"
            });
        }

        res.status(200).json(product) ;

    } catch (error) {
        res.status(500).json({message : error.message});
    }
   };

module.exports = {createProduct,
                  getProduct,
                  getProductById,
                  updateProduct
} ;