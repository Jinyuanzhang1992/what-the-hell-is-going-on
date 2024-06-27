const fs = require("fs");

const parseJson = (filePath) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        reject(err);
        return;
      }

      try {
        const parsedData = JSON.parse(data);
        resolve(parsedData);
      } catch (err) {
        reject(err);
      }
    });
  });
};

module.exports = {
  parseJson,
};
