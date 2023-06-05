const app = require('./app')
const mongoose = require("mongoose");
const {DB_HOST} = require("./config");
console.log(process.env);
mongoose.connect(DB_HOST)
    .then(() => app.listen(3000, () => {
      console.log("Database connection successful")
    }))
    .catch((error) => console.log(error.message));

