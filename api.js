const { request } = require("express");
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;


let url = "https://significado.herokuapp.com/passaro"

function fazGet(url) {
  let request = new XMLHttpRequest()
  request.open("GET", url, false)
  request.send()
  
  return request.responseText
}

console.log(fazGet(url))


 let mhttp = new XMLHttpRequest();
 mhttp.open(method, url, true);
 mhttp.onreadystatechange = () => {
   if (mhttp.readyState === 4) {
     if (mhttp.status === 200) {
       let desc = JSON.parse(mhttp.responseText);
       console.log(desc[0].meanings[0]);
     }
   }
 };
 
 mhttp.send();
