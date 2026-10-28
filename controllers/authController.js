const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


const register = async (req,res) => {
    try {
        const {name , email , password} = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                error: {
                    message: "name email and password are required"
                }
            });
        }

        if(password.length < 8) {
            return res.status(400).json({
                error : {
                    message : "password must be at least 8 characters"

                }
            });


        }


        const existingUser = await User.findOne({
            email: email.toLowerCase().trim()
        });


        if(existingUser) {
           return res.status(409).json({
            error : {
                message : "email already exists"
            }
           });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email: email.toLowerCase().trim(),
            passwordHash,
            role: "customer"
        });



        res.status(201).json({
            message: "account created successfully",

            user:{
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                error : {
                    message : "email already exists"
                }
            });
        }
        res.status(500).json({
            error: {
                message: "internal server error"
            }
        });
    }
};


module.exports = {register} ;