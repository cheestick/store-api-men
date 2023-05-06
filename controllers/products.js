const Product = require("../models/product");

const getAllProductsStatic = async (req, res) => {
  const products = await Product.find({
    featured: true,
  });
  res.status(200).json({ nbHits: products.length, products });
};
const getAllProducts = async (req, res) => {
  res.status(200).json({ message: "products route" });
};

module.exports = {
  getAllProducts,
  getAllProductsStatic,
};
