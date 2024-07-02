import mongoose from "mongoose";

const batmanschema = new mongoose.Schema({

    Name: { type: String, required: true },
    Age: { type: Number, required: false },
    Email: { type: String, required: true },
    Password: { type: String, required: true },
    Following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'batmanModel' }],
    Followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'batmanModel' }],
    Posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'postModel' }],
    DP: { type: String, required: false },

})

const batmanModel = mongoose.model('batmans', batmanschema)

export default batmanModel
