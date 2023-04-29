import asyncHandler from "express-async-handler";
import { create, find } from "../models/userFeedbackModel";
const dotenv = require("dotenv").config();

//@desc customer feedback
//@route POST /api/feedback
//@access public

const userFeedback_controller = asyncHandler ( async (req, res) => {
    const {name, email, rating, message} = req.body;

    if(!name || !email || !rating ){
        res.status(400);
        throw new Error("All fields are mandatory!");
    }

    const feedback = await create({
        name ,
        email,
        rating,
        user_message : message
    });

    console.log(`${feedback} \n Feedback recorded successfully!`);

    if(feedback){
        res.status(200).json(feedback);
    }
    else{
        res.status(400);
        throw new Error("Unable to record the feedback!");
    }
});

const userFeadback_featch = asyncHandler ( async (req, res) => {
    const feadback = await find();

    if(feadback)
        res.status(200).json(feadback);
})

export default {userFeedback_controller , userFeadback_featch};