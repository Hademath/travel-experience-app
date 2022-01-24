import mongoose, { ConnectOptions } from "mongoose";

let database: mongoose.Connection;
 const connect = () => {
  // add your own uri below
  const uri = process.env.MONGO_URI  as string;
  if (database) {
    return;
  }
  mongoose.connect(uri, {
    useNewUrlParser: true
  } as ConnectOptions);

  database = mongoose.connection;
  database.once("open", async () => {
    console.log("Connected to database");
  });
  database.on("error", () => {
    console.log("Error connecting to database");
  });
};
export const disconnect = () => {
  if (!database) {
    return;
  }
  mongoose.disconnect();
};

export { connect, mongoose}