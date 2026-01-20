// utils/fileUtils.js
const fs = require("fs");
const path = require("path");

class FileError extends Error {
  constructor(message) {
    super(message);
    this.name = "FileError";
  }
}

function getDataPath(filename) {

  return path.join(process.cwd(), filename);
}

function readJsonFile(filename) {
  const filePath = getDataPath(filename);

  try {
    const raw = fs.readFileSync(filePath, "utf8");
    // יזרוק אם JSON פגום
    return JSON.parse(raw);
  } catch (err) {
    if (err.code === "ENOENT") {
      // file not found
      throw new FileError("File not found");
    }
    if (err.name === "SyntaxError") {
      // corrupted json
      throw new FileError("Corrupted file");
    }
    throw new FileError("Read failure");
  }
}

function writeJsonFile(filename, data) {
  const filePath = getDataPath(filename);

  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
  } catch (err) {
    throw new FileError("Write failure");
  }
}

module.exports = {
  FileError,
  readJsonFile,
  writeJsonFile,
};
