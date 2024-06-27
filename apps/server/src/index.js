const cors = require("cors");
const express = require("express");
const { Env } = require("./utils/env");
const { z } = require("zod");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const multer = require("multer");
const fs = require("fs");

const upload = multer({ dest: "uploads/" });

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
  try {
    if (!req.files || req.files.length === 0) {
      throw new Error("Hey, where's the file????");
    }

    const { path } = req.files[0];

    fs.readFile(path, "utf8", (err, data) => {
      if (err) {
        res.send(`Error reading file: ${err.message}`);
        return;
      }

      try {
        const parsedData = JSON.parse(data);
        res.send(parsedData);
      } catch (err) {
        throw new Error("Fk, I can't parse this file");
      }
    });
  } catch (err) {
    res.send(`Something fked up ${err.message}`);
  }
});

app.post("/user", async (req, res) => {
  const users = req.body;

  try {
    const usersWithHashedPasswords = await Promise.all(
      users.map(async (user) => {
        console.log("开始加密密码");
        const hashedPassword = await bcrypt.hash(user.password, 10);
        console.log("hashedPassword", hashedPassword);
        const dob = new Date(Date.parse(user.dob.split("T")[0]));
        console.log("dob", dob);

        return {
          ...user,
          password: hashedPassword,
          dob: dob,
        };
      })
    );

    res
      .status(200)
      .send({ message: "yeah this work", users: usersWithHashedPasswords });
  } catch (error) {
    res.status(400).send(`FKKKKKK ${error.message}`);
  }
});

app.post("/parse-users-json", upload.array("files"), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      throw new Error("Hey, where's the file????");
    }

    const { path } = req.files[0];

    fs.readFile(path, "utf8", async (err, data) => {
      if (err) {
        res.send(`Error reading file: ${err.message}`);
        return;
      }

      try {
        const users = JSON.parse(data);

        const usersWithHashedPasswords = await Promise.all(
          users.map(async (user) => {
            const hashedPassword = await bcrypt.hash(user.password, 10);
            const dob = new Date(Date.parse(user.dob.split("T")[0]));

            return {
              ...user,
              password: hashedPassword,
              dob: dob,
            };
          })
        );

        res.status(200).send({
          message: "yeah this whole thing work",
          users: usersWithHashedPasswords,
        });
      } catch (err) {
        throw new Error("Fk, I can't parse this file");
      }
    });
  } catch (err) {
    res.send(`Something fked up ${err.message}`);
  }
});

app.listen(Env.Port, () => {
  console.log(`Hello app listening on port ${Env.Port}`);
});
