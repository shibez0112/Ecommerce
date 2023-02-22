const bodyParser = require("body-parser");
const express = require("express");
const dbConnect = require("./config/dbConnect");
const app = express();
const dotenv = require("dotenv").config();
const PORT = process.env.PORT || 3000;
const authRouter = require("./routes/authRoute");
// dbConnect();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

app.use("/api/user", authRouter);
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
