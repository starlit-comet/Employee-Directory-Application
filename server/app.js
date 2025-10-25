const express = require("express");
const bodyParser = require("body-parser");
const app = express();


app.use(bodyParser.json());

app.listen(3489, () => {
    console.log("Server is running on port 3489");
});

