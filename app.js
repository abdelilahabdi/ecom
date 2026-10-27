const express = require("express");

const app = express();

const productRoutes = require("./routes/productRoutes");


app.use(express.json());

app.use("/api/products", productRoutes);




app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok"
  });
});

module.exports = app;