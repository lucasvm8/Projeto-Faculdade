const fs = require("fs");
const pdf = require("pdf-parse");

let filePath = "XP.pdf";

async function readPdf(filePath) {
  let pdffile = fs.readFileSync(filePath);
  let data = await pdf(pdffile);
  try {
    return console.log(data.text);
  } catch (error) {
    console.log(error);
  }
}

readPdf(filePath);
