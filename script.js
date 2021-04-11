const fs = require("fs");
const pdf = require("pdf-parse");

let filePath = "./XP.pdf";

async function readPdf(filePath) {
  let pdfFile = fs.readFileSync(filePath);
  try {
    let data = await pdf(pdfFile).text;
    return data;
  } catch (err) {
    console.log(err);
  }
}

async function separarPalavras(filePath) {
  let pdfFile = fs.readFileSync(filePath);
  try {
    let data = await pdf(pdfFile);
    return data.text.toLowerCase().match(/\w[A-Za-zÀ-ú]+/g, "");
  } catch (err) {
    console.log(err);
  }
}

async function Palavras(filePath) {
  let pdfFile = fs.readFileSync(filePath);
  try {
    let data = await separarPalavras(filePath);
    return data.reduce((acc, curr) => {
      acc[curr] = (acc[curr] || 0) + 1;
      return acc;
    }, {});
  } catch (err) {
    console.log(err);
  }
}

async function topDezPalavras(filePath) {
  let pdfFile = fs.readFileSync(filePath);
  try {
    let data = await topPalavras(filePath);
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
