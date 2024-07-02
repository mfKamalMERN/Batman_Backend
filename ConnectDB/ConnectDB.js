import mongoose from "mongoose";
import batmanModel from "../Models/batmanmodel.js";

export const ConnectDB = async () => {
    try {

        await mongoose.connect(`mongodb+srv://mfk:test123@portfolio.lsuj3bc.mongodb.net/Batman?retryWrites=true&w=majority&appName=Portfolio`)

        const batmans = await batmanModel.find()

        console.log(`DB connected`);
        console.log(batmans[0].Name);
    } catch (error) {
        console.log(error);
    }
}