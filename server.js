require("dotenv").config() ;


const app = require("./app");
const connectDB = require("./config/db");

const PORT = 3001;

const startServer = async () => {
  try {
    await connectDB() ;

    app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  }) ;
} catch (error) {
  console.log("server startup failed:" , error.message);
  process.exit(1);
}

} ;
startServer () ;