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
app.use(cookieParser());

app.use(express.json());

const allowedOrigins = [
  "http://localhost:3000",
  "https://courses-api-production.up.railway.app/",
];

// Middleware to enable CORS with specific origins
app.use(
  cors({
    origin: function (origin, callback) {
      // Check if the origin is in the allowedOrigins array
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true); // Allow the request
      } else {
        callback(new Error("Not allowed by CORS")); // Deny the request
      }
    },
    credentials: true, // Allow credentials (cookies) to be sent and received
  })
);

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
