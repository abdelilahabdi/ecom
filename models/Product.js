const mongoose = require ("mongoose") ;

const productSchema = new mongoose.Schema({

    name : {
        type : String ,
        required : true,
        trim: true
    } ,

    description : {
        type : String ,
        trim : true 

    } ,

    priceCents : {
        type : Number ,
        required : true ,
        min: 1,
        validate: Number.isSafeInteger
    } ,

    

    available : {
        type : Boolean ,
        default : true 
    }
}) ;

module.exports = mongoose.model("Product",productSchema);
