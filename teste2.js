(function () {
  function r(e, n, t) {
    function o(i, f) {
      if (!n[i]) {
        if (!e[i]) {
          var c = "function" == typeof require && require;
          if (!f && c) return c(i, !0);
          if (u) return u(i, !0);
          var a = new Error("Cannot find module '" + i + "'");
          throw ((a.code = "MODULE_NOT_FOUND"), a);
        }
        var p = (n[i] = { exports: {} });
        e[i][0].call(
          p.exports,
          function (r) {
            var n = e[i][1][r];
            return o(n || r);
          },
          p,
          p.exports,
          r,
          e,
          n,
          t
        );
      }
      return n[i].exports;
    }
    for (
      var u = "function" == typeof require && require, i = 0;
      i < t.length;
      i++
    )
      o(t[i]);
    return o;
  }
  return r;
})()(
  {
    1: [function (require, module, exports) {}, {}],
    2: [
      function (require, module, exports) {
        (function (global) {
          (function () {
            "use strict";

            // ref: https://github.com/tc39/proposal-global
            var getGlobal = function () {
              // the only reliable means to get the global object is
              // `Function('return this')()`
              // However, this causes CSP violations in Chrome apps.
              if (typeof self !== "undefined") {
                return self;
              }
              if (typeof window !== "undefined") {
                return window;
              }
              if (typeof global !== "undefined") {
                return global;
              }
              throw new Error("unable to locate global object");
            };

            var global = getGlobal();

            module.exports = exports = global.fetch;

            // Needed for TypeScript and Webpack.
            if (global.fetch) {
              exports.default = global.fetch.bind(global);
            }

            exports.Headers = global.Headers;
            exports.Request = global.Request;
            exports.Response = global.Response;
          }.call(this));
        }.call(
          this,
          typeof global !== "undefined"
            ? global
            : typeof self !== "undefined"
            ? self
            : typeof window !== "undefined"
            ? window
            : {}
        ));
      },
      {},
    ],
    3: [
      function (require, module, exports) {
        const Fs = require("fs");
        const Pdf = require("./lib/pdf-parse.js");

        module.exports = Pdf;

        let isDebugMode = !module.parent;

        //process.env.AUTO_KENT_DEBUG

        //for testing purpose
        if (isDebugMode) {
          let PDF_FILE = "./test/data/05-versions-space.pdf";
          let dataBuffer = Fs.readFileSync(PDF_FILE);
          Pdf(dataBuffer)
            .then(function (data) {
              Fs.writeFileSync(`${PDF_FILE}.txt`, data.text, {
                encoding: "utf8",
                flag: "w",
              });
              debugger;
            })
            .catch(function (err) {
              debugger;
            });
        }
      },
      { "./lib/pdf-parse.js": 4, fs: 1 },
    ],
    4: [
      function (require, module, exports) {
        var PDFJS = null;

        function render_page(pageData) {
          //check documents https://mozilla.github.io/pdf.js/
          //ret.text = ret.text ? ret.text : "";

          let render_options = {
            //replaces all occurrences of whitespace with standard spaces (0x20). The default value is `false`.
            normalizeWhitespace: false,
            //do not attempt to combine same line TextItem's. The default value is `false`.
            disableCombineTextItems: false,
          };

          return pageData
            .getTextContent(render_options)
            .then(function (textContent) {
              let lastY,
                text = "";
              //https://github.com/mozilla/pdf.js/issues/8963
              //https://github.com/mozilla/pdf.js/issues/2140
              //https://gist.github.com/hubgit/600ec0c224481e910d2a0f883a7b98e3
              //https://gist.github.com/hubgit/600ec0c224481e910d2a0f883a7b98e3
              for (let item of textContent.items) {
                if (lastY == item.transform[5] || !lastY) {
                  text += item.str;
                } else {
                  text += "\n" + item.str;
                }
                lastY = item.transform[5];
              }
              //let strings = textContent.items.map(item => item.str);
              //let text = strings.join("\n");
              //text = text.replace(/[ ]+/ig," ");
              //ret.text = `${ret.text} ${text} \n\n`;
              return text;
            });
        }

        const DEFAULT_OPTIONS = {
          pagerender: render_page,
          max: 0,
          //check https://mozilla.github.io/pdf.js/getting_started/
          version: "v1.10.100",
        };

        async function PDF(dataBuffer, options) {
          var isDebugMode = false;

          let ret = {
            numpages: 0,
            numrender: 0,
            info: null,
            metadata: null,
            text: "",
            version: null,
          };

          if (typeof options == "undefined") options = DEFAULT_OPTIONS;
          if (typeof options.pagerender != "function")
            options.pagerender = DEFAULT_OPTIONS.pagerender;
          if (typeof options.max != "number") options.max = DEFAULT_OPTIONS.max;
          if (typeof options.version != "string")
            options.version = DEFAULT_OPTIONS.version;
          if (options.version == "default")
            options.version = DEFAULT_OPTIONS.version;

          PDFJS = PDFJS
            ? PDFJS
            : require(`./pdf.js/${options.version}/build/pdf.js`);

          ret.version = PDFJS.version;

          // Disable workers to avoid yet another cross-origin issue (workers need
          // the URL of the script to be loaded, and dynamically loading a cross-origin
          // script does not work).
          PDFJS.disableWorker = true;
          let doc = await PDFJS.getDocument(dataBuffer);
          ret.numpages = doc.numPages;

          let metaData = await doc.getMetadata().catch(function (err) {
            return null;
          });

          ret.info = metaData ? metaData.info : null;
          ret.metadata = metaData ? metaData.metadata : null;

          let counter = options.max <= 0 ? doc.numPages : options.max;
          counter = counter > doc.numPages ? doc.numPages : counter;

          ret.text = "";

          for (var i = 1; i <= counter; i++) {
            let pageText = await doc
              .getPage(i)
              .then((pageData) => options.pagerender(pageData))
              .catch((err) => {
                // todo log err using debug
                debugger;
                return "";
              });

            ret.text = `${ret.text}\n\n${pageText}`;
          }

          ret.numrender = counter;
          doc.destroy();

          return ret;
        }

        module.exports = PDF;
      },
      {},
    ],
    5: [
      function (require, module, exports) {
        const fs = require("fs");
        const pdf = require("pdf-parse");
        const fetch = require("node-fetch");

        let filePath = "uploads/file.pdf";
        let pdfFile = fs.readFileSync(filePath);

        const terminologia = "./terminologia.json";
        const terminologias = fs.readFileSync(terminologia);

        async function readPdf() {
          try {
            let data = await pdf(pdfFile);
            return console.log(data.text);
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

            return console.log(unico);
          } catch (err) {
            console.log(err);
          }
        }

        terminologiasTexto();
      },
      { fs: 1, "node-fetch": 2, "pdf-parse": 3 },
    ],
  },
  {},
  [5]
);
