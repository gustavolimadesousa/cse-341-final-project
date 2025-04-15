const express = require("express");
const bodyParser = require("body-parser");
const app = express();

const mongodb = require("./data/database");
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.json());
app.use("/", require("./routes"));

mongodb.initDb((err) => {
  if (err) {
    console.log(err);
  } else {
    app.listen(port, () => {
      console.log(`Database is listening and node server is running on port ${port}`);
    });
  }
});
