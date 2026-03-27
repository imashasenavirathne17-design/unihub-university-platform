const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const internshipRoutes = require("./routes/internshipRoutes");
const skillRoutes = require("./routes/skillRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// Serve uploaded files statically
app.use('/uploads', express.static(require('path').join(__dirname, 'uploads')));

const { startExpiryJob } = require("./jobs/expiryJob");

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
    startExpiryJob();
  })
  .catch(err => console.log(err));

app.use("/api/users", authRoutes);
app.use("/api/internships", internshipRoutes);
app.use("/api/skills", skillRoutes);

app.get("/", (req, res) => {
  res.send("University API Running");
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
