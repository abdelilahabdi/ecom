const express = require("express");

const app = express();

const productRoutes = require("./routes/productRoutes");

const authRoutes = require("./routes/authRoutes") ;
const orderRoutes = require("./routes/orderRoutes");


app.use(express.json());

app.use("/api/products", productRoutes);

app.use("/api/auth", authRoutes) ;

app.use("/api/orders",orderRoutes);


app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok"
  });
});

module.exports = app;