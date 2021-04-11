const fs = require("fs");
const pdf = require("pdf-parse");

let filePath = "./XP.pdf";
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

async function palavras(filePath) {
  try {
    let data = await separarPalavras(filePath);
    return console.log(
      data.reduce((acc, curr) => {
        acc[curr] = (acc[curr] || 0) + 1;
        return acc;
      }, {})
    );
  } catch (err) {
    console.log(err);
  }
}

async function topDezPalavras(filePath) {
  try {
    let data = await palavras(filePath);
    return console.log(
      Object.entries(data)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
    );
  } catch (err) {
    console.log(err);
  }
}

topDezPalavras(filePath);
