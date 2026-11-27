const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// #region Generate JWT Token
const generateToken = (userId) => {
    return jwt.sign({id: userId},process.env.JWT_SECRET,{ expiresIn: process.env.JWT_EXPIRY });

}
// #endregion

// #region REGISTER USER
const registerUser = async (req,res) => {
    try{
        const {user_name,email,password} = req.body;

        if(!user_name || !email || !password){
            return res.status(400).json({message: "All fields are required!"});
        }

        // EXISTING USER CHECK
        const existingUser = await User.findOne({email:email.toLowerCase().trim()});
        if(existingUser){
            return res.status(400).json({message: "User already exists!"});
        }

        // HASH PASSWORD
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);

        // CREATE USER
        const newUser = await User.create({
            user_name: user_name.trim(),
            email: email.toLowerCase().trim(),
            password: hashedPassword
        })

        const token = generateToken(newUser._id);
        res.status(201).json({message: "User created successfully", token,
            user: {
                id: newUser._id,
                user_name: newUser.user_name,
                email: newUser.email
            }
        });
        

    }
    catch(error){
        res.status(500).json({message: "Server Error", error: error.message});
    }
};
// #endregion


// #region LOGIN USER
const loginUser = async (req,res) => {
    try{
        const {email,password} = req.body;

        if(!email || !password){
            return res.status(400).json({message: "All fields are required!"});
        }

        // SEARCH USER
        const user = await User.findOne({email: email.toLowerCase().trim()}).select("+password");

        if(!user){
            return res.status(401).json({message: "Invalid credentials!"});            
        }

        const isPasswordMatch = await bcrypt.compare(password,user.password);
        if(!isPasswordMatch){
            return res.status(401).json({message: "Invalid credentials!"});
        }

        // GENERATE TOKEN
        const token = generateToken(user._id);
        res.status(200).json({message: "Login successful", token,
            user: {
                id: user._id,
                user_name: user.user_name,
                email: user.email
            }
        });

    }
    catch(error){
        res.status(500).json({message: "Server Error", error: error.message});
    }
}
// #endregion

module.exports = {
    registerUser,loginUser
};