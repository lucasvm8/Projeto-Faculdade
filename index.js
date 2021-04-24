const { response } = require("express");
const express = require("express");
const app = express();
const multer = require("multer");
const teste = require("./script");

app.set("view engine", "ejs");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + ".pdf");
  },
});

const upload = multer({ storage });

app.post("/", async function (req, res) {
  const content = await readPdf();
  res.send(content);
});

app.get("/", (req, res) => {
  res.render("index");
});

app.listen(8080, () => {
  console.log("Servidor rodando!");
});
