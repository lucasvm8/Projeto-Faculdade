
let url = "https://significado.herokuapp.com/palavra";
let method = "GET"

let xhttp = new XMLHttpRequest();
xhttp.open(method, url);
xhttp.onreadystatechange = () => {
  if (xhttp.readyState == 4) {
    if (xhttp.status == 200) {
      console.log(xhttp.responseText);
    }
  }
};

xhttp.send();