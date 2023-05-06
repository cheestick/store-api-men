require("dotenv").config();
// async errors

const express = require("express");
const app = express();

const connectDB = require("./db/connect");

const notFoundMiddleware = require("./middleware/not-found");
const errorMiddleware = require("./middleware/error-handler");

const { API_PRODUCTS_URL } = require("./utils/const");

// middleware
app.use(express.json());

// routes
app.get("/", (req, res) =>
  res.send('<h1>Stroe API</h1><a href="/api/v1/products">product route</a>')
);

app.use(API_PRODUCTS_URL, (f) => f);

// product route

// custom middlewares
app.use(notFoundMiddleware);
app.use(errorMiddleware);

const { PORT = 3000, MONGO_URI } = process.env;

const start = async () => {
  try {
    await connectDB(MONGO_URI);
    app.listen(PORT, console.log(`server is listening port ${PORT}...`));
  } catch (error) {
    console.log(error.message);
  }
};

start();
