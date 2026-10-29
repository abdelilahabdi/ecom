const mongoose = require("mongoose") ;

const orderSchema = new mongoose.Schema({
    client : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required: true 
    },

    items: [
        {
       product : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true 
       },


       name: {
        type: String,
        required: true
       },


       quantity: {
         type : Number,
         required: true ,
         min: 1 ,
         max: 10
       },


       unitPriceCents: {
        type: Number,
        required: true,
        min: 1
       }
    }
],



   totalCents : {
    type: Number ,
    required: true ,
    min: 1
   },


   status: {
    type: String,
    enum: ["new", "processed"],
    default: "new"
   }
});


module.exports = mongoose.model("Order" , orderSchema) ;