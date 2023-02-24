const bodyParser = require("body-parser");
const express = require("express");
const dbConnect = require("./config/dbConnect");
const { notFound, errorHandler } = require("./middlewares/errorHandler");
const app = express();
const dotenv = require("dotenv").config();
const authRouter = require("./routes/authRoute");
const cookieParser = require("cookie-parser");
const PORT = process.env.PORT || 3000;
//dbConnect();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));
app.use(cookieParser());

// Routing
app.use("/api/user", authRouter);


app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
