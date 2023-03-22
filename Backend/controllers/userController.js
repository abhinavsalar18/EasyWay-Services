const asyncHandler = require("express-async-handler");
const User = require("../models/userTestModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookie = require("cookie-parser");
const dotenv = require("dotenv").config();

//@desc Register a user
//@route POST /api/users/register
//@access public

const userRegistration = asyncHandler ( async (req, res) => {

    const {username, email, password} = req.body;

    if(!username || !email || !password){
        res.status(400);
        throw new Error("All fields are mandatory");
    }

    const userAvailable  = await User.findOne({ email });

    if(userAvailable){
        res.status(400);
        throw new Error("User already registered with this email!");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Hashed Password: ", hashedPassword);
    const user = await User.create( {
        username,
        email,
        password : hashedPassword,
    });

    console.log(`${user}\nUser registered successfully!`);

    if(user){
        res.status(201).json({_id: user.id, username: user.username, email: user.email, password: user.password});
    }
    else{
        res.status(400);
        throw new Error("User data is not valid!");
    }
    // res.status(200).json({message : "user registered!"});
});


//@desc user login
//@route POST /api/users/login
//@access public
const userLogin = asyncHandler ( async (req, res) => {

    const {email, password} = req.body;

    if(!email || !password){
        res.status(400);
        throw new Error("All fields are mandatory!");
    }

    // comparing password
    const user = await User.findOne({ email });

    if(user && (await bcrypt.compare(password, user.password))){
        const payload = {
            id: user._id
        };
        
        const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: "2h"});
        res.cookie('access_token', token, {
            httpOnly: true
        });

        res.status(200).json({_id: user.id, username: user.username, email: user.email});

        console.log(`${user} login successfull!`);
    }
    else{
        res.status(401);
        throw new Error("Invalid credentials! Email or password is not valid!");
    }

    // res.status(200).json({message : "user login successfull!"});
});

//@desc logout user
//@route GET /api/users/logout
//@access public

const userLogout = asyncHandler ( async (re, res) =>{
    res.clearCookie("access_token");
    res.status(200).json({ message: "Logout success!"});
})

//@desc user profile
//@route GET /api/users/profile
//@access private

const userProfile = asyncHandler ( async (req, res) => {
   const token = req.cookies.access_token;
   const userId = jwt.verify(token, process.env.SECRET_KEY);
   if(user){

       const userId = userId;
       const user = await User.findOne({ userId });
       res.status(200).json({_id: user._id, username: user.username, email: user.email});
   }
});



module.exports = {
    userRegistration,
    userLogin,
    userLogout,
    userProfile
}; 

