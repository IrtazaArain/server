const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const crimeRoutes = require("./routes/crimeRoutes");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/crime", crimeRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to SafeNav API");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
