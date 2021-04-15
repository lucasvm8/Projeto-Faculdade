const fs = require("fs");
const pdf = require("pdf-parse");

let filePath = "uploads/file.pdf";
let pdfFile = fs.readFileSync(filePath);

async function readPdf() {
  try {
    let data = await pdf(pdfFile);
    return console.log(data.text);
  } catch (err) {
    console.log(err);
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
    return console.log(
      Object.entries(data)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 20)
    );
  } catch (err) {
    console.log(err);
  }
}

topDezPalavras(filePath);
