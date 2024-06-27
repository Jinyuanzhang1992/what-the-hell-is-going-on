const cors = require("cors");
const express = require("express");
const { Env } = require("./utils/env");
const { z } = require("zod");
const bodyParser = require("body-parser");
const multer = require("multer");

const upload = multer({ dest: "uploads/" });

const { parseJson } = require("./utils/parser");
const { processUsers } = require("./user");

const app = express();
app.use(
  cors({
    origin: "*",
  })
);
app.use(bodyParser.json());

app.get("/health", (_req, res) => {
  res.send("Ok");
});

app.post("/hash", async (req, res) => {
  try {
    const schema = z.object({
      key: z.string(),
    });

    const { key } = schema.parse(req.body);

    const hashedKey = await bcrypt.hash(key, 10);

    res.send({
      key,
      hashedKey,
    });
  } catch (error) {
    res.status(400).send(`YOU FKED UP! ${error.message}`);
  }
});

app.post("/parse-json", upload.array("files"), async (req, res) => {
  console.log("processing json");
  try {
    if (!req.files || req.files.length === 0) {
      throw new Error("Hey, where's the file????");
    }
    const { path } = req.files[0];

    const data = await parseJson(path);

    res.status(200).send({ message: "yeah, parsed json", data });
    console.log("done✨✨✨✨✨✨✨");
  } catch (err) {
    res.send(`Something fked up ${err.message}`);
  }
});

app.post("/users", async (req, res) => {
  console.log("processing user");
  const data = req.body;

  try {
    const users = await processUsers(data);

    res.status(200).send({ message: "yeah /users work", users });
    console.log("done✨✨✨✨✨✨✨");
  } catch (error) {
    res.status(400).send(`FKKKKKK ${error.message}`);
  }
});

app.post("/parse-users-json", upload.array("files"), async (req, res) => {
  console.log("processing json then give it to user");

  try {
    if (!req.files || req.files.length === 0) {
      throw new Error("Hey, where's the file????");
    }

    const { path } = req.files[0];

    const data = await parseJson(path);
    const users = await processUsers(data);

    res.status(200).send({
      message: "yeah, /parse-users-json work",
      users,
    });
    console.log("done✨✨✨✨✨✨✨");
  } catch (err) {
    res.send(`Something fked up ${err.message}`);
  }
});

app.listen(Env.Port, () => {
  console.log(`Hello app listening on port ${Env.Port}`);
});
