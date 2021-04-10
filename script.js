const fs = require('fs');
const pdf = require('pdf-parse');

let filePath = "XP.pdf"

async function readPdf(filePath) {
  let pdffile = fs.readFileSync(filePath);
  try {
    return await pdf(pdffile), soma(2)
  } catch (error) {
      console.log(error)
  }
}

function soma (a) {
  return console.log(a)
}

readPdf(filePath)