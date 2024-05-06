const express = require("express");
const env = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDb = require("./config/dbConfig");
const courseRoute = require("./routes/courseRoute");
const userRoute = require("./routes/userRoutes");

env.config();

connectDb();

const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.get("/", (req, res, next) => {
  res.json({
    message: "Api is running",
  });
});

app.use("/v1/api/user", userRoute);
app.use("/v1/api/course", courseRoute);

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
