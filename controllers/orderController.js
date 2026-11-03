const Order = require("../models/Order");
const Product = require("../models/Product");
const mongoose = require("mongoose");


const createOrder = async (req , res ) => {
    try {
        const items = req.body.items;

        // if(!items || items.length === 0) {
        //     return res.status(400).json({
        //         error: {
        //             message: "order items are required"
        //         }
        //     });
        // }

        if (!Array.isArray(items) || items.length === 0 || items.length > 10) {
      return res.status(400).json({
        error: {
            message : "order must contain between 1 and 10 items"
           }
        });
      }


     

       
      const orderItems = [] ;
      const productIds = [] ;


      for(const item of items) {
        if (!item || !item.product || !Number.isInteger(item.quantity)) {
            return res.status(400).json({
                error: {
                    message: "product and valid quantity are required"
                }
            });
        }



        if (item.quantity < 1 || item.quantity > 10) {
            return res.status(400).json({
                error: {
                    message: "quantity must be between 1 and 10"
                }
            });
        }


        if (!mongoose.Types.ObjectId.isValid(item.product)) {
            return res.status(400).json({
                error: {
                    message: "invalid product ID"
                }
            });
        }



        const productId = item.product.toString() ;

        if (productIds.includes(productId)) {
            return res.status(400).json({
                error: {
                    message: "duplicate products are not allowed"
                }
            });
        }

        productIds.push(productId);




        const product = await Product.findById(item.product);

        if(!product) {
            return res.status(404).json({
                error: {
                    message: "product not found"
                }
            });
        }


        if (!product.available) {
            return res.status(409).json({
                error: {
                    message: "product is not available"
                }
            });
        }

        orderItems.push({
         product : product._id ,
         name : product.name ,
         quantity: item.quantity,
         unitPriceCents: product.priceCents
        }) ;

    }



         

       
      
      

      let totalCents = 0 ;
      for (const item of orderItems) {
        totalCents = totalCents + item.unitPriceCents * item.quantity ;

      }

      const order = await Order.create({
        client: req.user.id,
        items: orderItems,
        totalCents: totalCents
      });

      return res.status(201).json({
        message: "order created successfully",
        order: order
      });


    }catch (error) {
        console.error(error) ;

        return res.status(500).json({
            error : {
                message: "Server error"
            }
        });
    }
};


const getMyOrders = async (req,res) => {
    try {
        const orders = await Order.find({
            client : req.user.id
        });

        return res.status(200).json({
            orders: orders
        });

    } catch (error) {
        console.error(error) ;


        return res.status(500).json({
            error: {
                message: "server error"
            }
        });
    }
};

const getAllOrders = async (req,res) => {
    try {
        const orders = await Order.find();

        return res.status(200).json({
            orders: orders
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            error: {
                message: "Server error"
            }
        });
    }
};



const getOrderById = async (req,res) => {
  try {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            error: {
                message: "invalid order ID"
            }
        });
    }

    const order = await Order.findById(id) ;

    if(!order) {
        return res.status(404).json({
            error:{
                message: "order not found"
            }
        });
    }

    if (req.user.role === "customer" && order.client.toString() !== req.user.id) {
        return res.status(403).json({
            error:{
                message: "access forbidden"
            }
        });
    }

    return res.status(200).json({
        order: order
    });
  } catch (error) {
    console.error(error);


    return res.status(500).json({
        error: {
            message: "server error"
        }
    });
  }
};


const processOrder = async (req,res) => {
    try {
        const id = req.params.id ;


        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                error: {
                    message: "invalid order ID"
                }
            });
        }

        const order = await Order.findById(id);


        if(!order) {
            return res.status(404).json({
                error: {
                    message: "order not found"
                }
            });
        }

        if(order.status === "processed") {
            return res.status(400).json({
                error: {
                    message: "order is already processed"
                }
            });
        }

        order.status = "processed" ;

        await order.save() ;

        return res.status(200).json({
            message: "order processed successfully" ,
            order: order
        }) ;
    } catch (error) {
        console.error(error) ;
         
        return res.status(500).json({
            error: {
                message: "server error"
            }
        });
    }
};

module.exports = {createOrder , getMyOrders , getAllOrders , getOrderById , processOrder} ;