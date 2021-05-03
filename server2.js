const express = require("express");
const app = express();
const multer = require("multer");
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
      

    pdf(pdfFile).then(function(data){
        return data.text;
    })
    
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
          return console.log(data.length);
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
    
    async function apresentar() {
    const data = await terminologiasTexto()
    res.render("resposta", {
    termin: data
    })}

  apresentar()
    
});


app.listen(4200, () => {
    console.log("Servidor rodando!");
});
