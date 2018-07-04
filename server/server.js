const path = require("path");
const publicPath = path.join(__dirname, "../public");
const express = require("express");
const app = express();
let port = process.env.PORT || 3000;

app.use(express.static(publicPath));

app.listen(port, () => console.log(`Server running on port ${port}`));