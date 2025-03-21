import mongoose from "mongoose";
import chalk from "chalk";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(
      chalk.green("✓") +
        chalk.blue("MongoDB Connected: ") +
        chalk.yellow(conn.connection.host)
    );
  } catch (error) {
    console.log("Error connection to MongoDB: ", error.message);
    process.exit(1); // 1 is failure, 0 is success
  }
};
