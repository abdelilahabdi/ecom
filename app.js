const express = require("express");

const app = express();

const productRoutes = require("./routes/productRoutes");

const authRoutes = require("./routes/authRoutes") ;

app.use(express.json());

app.use("/api/products", productRoutes);

app.use("/api/auth", authRoutes) ;



app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok"
  });
});

module.exports = app;