const cors = require("cors");
const express = require("express");
const { Env } = require("./utils/env");

const app = express();
app.use(
  cors({
    origin: "*",
  })
);

app.get("/health", (_req, res) => {
  res.send("Ok");
});

app.listen(Env.Port, () => {
  console.log(`Hello app listening on port ${Env.Port}`);
});
