const jwt = require("jsonwebtoken");
const User = require("../models/userSchema");
const cookieParser = require("cookie-parser");

exports.protect = async (req, res, next) => {
  let token;
  token = req.cookies.token;
  console.log(token);
  if (token) {
    let decoded;

    jwt.verify(token, process.env.JWT_SECRET, (err, tokenRes) => {
      try {
        decoded = tokenRes;
      } catch (error) {
        if (err.name === "TokenExpiredError") {
          return res
            .status(401)
            .json({ error: "Unauthorized- Token has expired" });
          //throw new Error("");
        }
        return res.status(401).json({ message: "token expired" });
      }
      decoded = tokenRes;
      res.locals.id = decoded.id;
    });

    const user = await User.findById(decoded.id);

    if (user) {
      req.user = user;
      next(res.locals.id);
    } else {
      return res.status(401).json({ error: "Unauthorized - user not found" });
      //throw new Error("");
    }
  } else {
    return res.status(401).json({ error: "Unauthorized - token not found" });
  }
};
