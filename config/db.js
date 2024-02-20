import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const res = await mongoose.connect(process.env.MONGODB_URI);
    console.log(
      `MongoDB connected successfully with host : ${res.connection.host}`
    );
  } catch (error) {
    console.log(`MongoDB Connection Error : `, error.message);
    process.exit(1);
  }
};

export default connectDB;
