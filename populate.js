require("dotenv").config();

const connectDB = require("./db/connect");
const Product = require("./models/product");

const jsonProducts = require("./products.json");

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    console.log("-> mongo connection is successful");
    await Product.deleteMany({});
    console.log("-> All data was deleted from Produc DB");
    await Product.create(jsonProducts);
    console.log("-> Products was populated");
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

start();
