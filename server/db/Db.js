import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectToMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL); // `${import.meta.env.MONGODB_URL}` this is specific to vite and your local machine.
    console.log("Connected To MongoDB");
  } catch (err) {
    console.log("Error Connecting To MongoDB", err.message);
  }
};

export default connectToMongoDB;
