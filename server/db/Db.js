import mongoose from "mongoose";

const connectToMongoDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://prem9810683167:K3mV8vcPQ6HJ6Q1M@cluster0.hqbi7go.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
    console.log("Connected To MongoDB");
  } catch (err) {
    console.log("Error Connecting To MongoDB", err.message);
  }
};

export default connectToMongoDB;
