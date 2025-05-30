import mongoose from "mongoose";

const connectToMongoDB = async () => {
  try {
    await mongoose.connect(
      `${import.meta.env.MONGODB_URL}`);
    console.log("Connected To MongoDB");
  } catch (err) {
    console.log("Error Connecting To MongoDB", err.message);
  }
};

export default connectToMongoDB;
