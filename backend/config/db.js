import mongoose from "mongoose";

const connectDB = async () => {
  const mongoUri =
    process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/northpoint-crm";

  const connection = await mongoose.connect(mongoUri);

  console.log(`MongoDB connected: ${connection.connection.host}`);
};

export default connectDB;
