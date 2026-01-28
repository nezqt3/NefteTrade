const express = require("express");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT;

app.get("/health", (req, res) => {
  res.send("OK");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
