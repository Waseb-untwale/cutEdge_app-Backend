const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const blogCtrl= require('./controllers/blogCtrl')
const app = express();
const port = 5000;
const blogRouter = require('./routes/blogRouter')
const userRouter = require('./routes/userRouter')
const categoryRouter = require('./routes/categoryRouter')
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

mongoose.connect("mongodb+srv://untwalewaseb:9mRY22uc8gtP7xNx@cutedge-app.eotg7.mongodb.net/?retryWrites=true&w=majority&appName=CutEdge-app", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("Connected to MongoDB"))
  .catch(err => console.log(err));

app.get('/', (req, res) => {
  res.send('Hello World');
});



app.use('/user',userRouter)
app.use('/api',blogRouter)
app.use('/api/categories', categoryRouter);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
