import mongoose from "mongoose";


const postschema = new mongoose.Schema({

    Caption: { type: String, required: false },

    Owner: { type: mongoose.Schema.Types.ObjectId, ref: "batmanModel" },

    Img: { type: String, required: false },

    Likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "batmanModel" }],

    Comments: [{ CommentedBy: { type: mongoose.Schema.Types.ObjectId, ref: "batmanModel" }, Comment: { type: String, required: false } }],

})


export const postModel = mongoose.model('post', postschema)