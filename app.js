const express = require("express");

const app = express();

const productRoutes = require("./routes/productRoutes");

const authRoutes = require("./routes/authRoutes") ;
const orderRoutes = require("./routes/orderRoutes");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");

app.use(express.json());

app.use("/api/products", productRoutes);

app.use("/api/auth", authRoutes) ;

app.use("/api/orders",orderRoutes);


app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok"
  });
});

// Swagger Documentation
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

module.exports = app;