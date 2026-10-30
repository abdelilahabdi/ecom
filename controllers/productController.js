const Product = require("../models/Product") ;
const mongoose = require("mongoose");
const createProduct = async (req,res) => {

    try {
        const {name , description , priceCents , available} = req.body ;


        const product = await Product.create({
            name,
            description,
            priceCents,
            available
        });

        res.status(201).json(product) ;
    } catch (error) {
        res.status(500).json({message : error.message}) ;
    }
};

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

        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                error: {
                    message : "invalid product ID"
                }
            });
        }
        const product = await Product.findById(req.params.id);


        if(!product) {
            return res.status(404).json({
                error : {
                       message : "Product not found"
                }
                
            });
        }

        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({
            error : {
              message : error.message
            }
}) ;
    }
};


   const updateProduct = async (req , res) => {
    try {
        if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                error : {
                    message : "Invalid product ID"
                }
            });
        }

        const product = await Product.findById(req.params.id);


        if(!product){
            return res.status(404).json({
                error : {
                message: "product not found"
            }
            });
        }

        if (req.body.name !== undefined) {
            product.name = req.body.name ;
        }

        if (req.body.description !== undefined) {
            product.description = req.body.description ;
        }

        if (req.body.priceCents !== undefined) {
            product.priceCents = req.body.priceCents ;
        }

        if(req.body.available !== undefined) {
            product.available = req.body.available ;
        }
        await product.save() ;

        res.status(200).json(product) ;

    } catch (error) {

        if (error.name === "ValidationError" || error.name === "CastError" ) {
            return res.status(400).json({
                error : {
                    message: "invalid product data"
                }
            });
        }
        res.status(500).json({
            error : {
             message : "internal server error"
            }
        });
    }
   };

module.exports = {createProduct,
                  getProduct,
                  getProductById,
                  updateProduct
} ;