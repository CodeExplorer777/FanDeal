const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");


const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const posterRoutes = require("./routes/posterRoutes");



const connectDB = require("./config/db");

dotenv.config();

const app = express();


//#region Middlewares 
app.use(cors());
app.use(express.json());
// #endregion

// #region Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/uploads",express.static("uploads"));
app.use("/api/products",productRoutes);
app.use("/api/posters",posterRoutes);
// #endregion


//#region   Connect to MongoDB
connectDB();
//#endregion 


app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});



