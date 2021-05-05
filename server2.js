const express = require("express");
const app = express();
const multer = require("multer");
const babel = require("babel-polyfill")
const { toNamespacedPath } = require("path");

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

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/upload", upload.single("file"), async function (req, res) {
  const fs = require("fs");
  const pdf = require("pdf-parse");

  let filePath = "uploads/file.pdf";
  let pdfFile = fs.readFileSync(filePath);

  const terminologia = "./terminologia.json";
  const terminologias = fs.readFileSync(terminologia);

  pdf(pdfFile).then(function (data) {
    return data.text;
  });

  async function readPdf() {
    try {
      let data = await pdf(pdfFile);
      return data.text;
    } catch (err) {
      console.log(err);
    }
  }

  async function readTerm() {
    try {
      const data = await JSON.parse(terminologias);
      let array = [];
      array = data[1];
      return console.log(array);
    } catch (error) {
      console.log(error);
    }
  }

  async function separarPalavras() {
    try {
      let data = await pdf(pdfFile);
      return data.text.toLowerCase().match(/\w[A-Za-zÀ-ú]+/g, "");
    } catch (err) {
      console.log(err);
    }
  }

  async function terminologiasTexto() {
    try {
      const data = await separarPalavras(pdfFile);
      const term = await JSON.parse(terminologias);
      let array = [];

      for (i = 0; i < data.length; i++) {
        for (j = 0; j < term.length; j++)
          if (data[i] == term[j].terminologia) {
            array[i] = data[i];
          }
        }
        
      var unico = array.filter(function (elem, index, self) {
        return index === self.indexOf(elem);
      });

      return unico;
    } catch (err) {
      console.log(err);
    }
  }

  async function quantidadeDeCaracteres() {
    try {
      let data = await separarPalavras(pdfFile);
      let array = [];

      for (i in data) {
        if (data[i].length > 6) {
          array[i] = data[i];
        }
      }

      let palavrasMaiorQueDois = array.filter(function (el) {
        return el != null;
      });

      return palavrasMaiorQueDois;
    } catch (err) {
      console.log(err);
    }
  }

  async function agruparPalavras() {
    try {
      let data = await quantidadeDeCaracteres(filePath);
      return data.reduce((acc, curr) => {
        acc[curr] = (acc[curr] || 0) + 1;
        return acc;
      }, {});
    } catch (err) {
      console.log(err);
    }
  }

  async function topDezPalavras() {
    try {
      let data = await agruparPalavras(filePath);
      return Object.entries
        .then(data)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);
    } catch (err) {
      console.log(err);
    }
  }

  async function apresentar() {
    const data = await terminologiasTexto();
    const datap = await agruparPalavras();
    res.render("resposta", {
      termin: data,
      palavr: JSON.stringify(datap),
    });
  }

  apresentar();
});

app.listen(4200, () => {
  console.log("Servidor rodando!");
});
