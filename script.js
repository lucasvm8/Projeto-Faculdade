const fs = require('fs');
const pdf = require('pdf-parse');
const selectFile = document.querySelector('texto')

let pdffile = fs.readFileSync(selectFile)

pdf(pdffile).then(function (data){
    console.log(data.text)
})