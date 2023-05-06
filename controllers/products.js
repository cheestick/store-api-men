const Product = require("../models/product");

const getAllProductsStatic = async (req, res) => {
  const products = await Product.find({
    featured: true,
  });
  res.status(200).json({ nbHits: products.length, products });
};

const getAllProducts = async (req, res) => {
  const { featured, company, name, sort, fields, numericFilters } = req.query;
  const queryObject = {};

  if (featured) {
    queryObject.featured = featured === "true" ? true : false;
  }
  if (company) {
    queryObject.company = company;
  }
  if (name) {
    queryObject.name = { $regex: name, $options: "i" };
  }

  // numeric filters
  if (numericFilters) {
    const operatorMap = {
      ">": "$gt",
      ">=": "$gte",
      "=": "$eq",
      "<": "$lt",
      "<=": "$lte",
    };

    const reqEx = /\b(<|>|=|>=|<=)\b/g;
    let filters = numericFilters.replace(
      reqEx,
      (match) => `-${operatorMap[match]}-`
    );

    const options = ["price", "rating"];
    filters = filters.split(",").forEach((item) => {
      const [field, operator, value] = item.split("-");
      if (options.includes(field)) {
        queryObject[field] = { [operator]: Number(value) };
      }
    });
  }

  let result = Product.find(queryObject); //await was removed

  // sorting feature
  if (sort) {
    result = result.sort(sort.split(",").join(" "));
  } else {
    result = result.sort("createdAt");
  }

  // fields
  if (fields) {
    const fieldList = fields.split(",").join(" ");
    result = result.select(fieldList);
  }

  // pagination and limiter
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  result = result.skip(skip).limit(limit);

  // getting the result
  const products = await result;

  res.status(200).json({ nbHits: products.length, products });
};

module.exports = {
  getAllProducts,
  getAllProductsStatic,
};
