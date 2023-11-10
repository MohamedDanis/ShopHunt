import mongoose from "mongoose";

const connectDB = async () => {
try {
  await mongoose.connect(process.env.MONGO, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
} catch (error) {
  console.log(error,9606);
  throw new Error("connection failed");
}
}

export default connectDB;