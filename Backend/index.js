const express = require("express");
const dotenv = require("dotenv");
const connectDB = require('./config/database')
const authRoutes = require('./routes/authRoutes')
const storyRoutes = require('./routes/storyRoutes')
const cors = require('cors')

const app = express();
dotenv.config();
connectDB()


app.use(express.json());
app.use(cors())  
app.use('/api/auth',authRoutes);
app.use('/api/story', storyRoutes)


const port = process.env.PORT;

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
