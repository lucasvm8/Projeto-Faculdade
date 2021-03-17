const fs = require('fs');
const pdf = require('pdf-parse');

let pdffile = fs.readFileSync('XP.pdf')

pdf(pdffile).then(function (data){
    console.log(data.text)
})