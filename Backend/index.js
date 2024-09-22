const express = require("express");
const dotenv = require("dotenv");
const connectDB = require('./config/database')
const authRoutes = require('./routes/authRoutes')

const app = express();
dotenv.config();
connectDB()

app.use(express.json());
app.use('/api/auth',authRoutes);


const port = process.env.PORT;

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
