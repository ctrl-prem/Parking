import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectToMongoDB = async () => {
  try {
    await mongoose.connect("mongodb+srv://prem9810683167:K3mV8vcPQ6HJ6Q1M@cluster0.hqbi7go.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"); // `${import.meta.env.MONGODB_URL}` this is specific to vite and your local machine.
    console.log("Connected To MongoDB");
  } catch (err) {
    console.log("Error Connecting To MongoDB", err.message);
  }
};

export default connectToMongoDB;
