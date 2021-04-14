let url = "https://significado.herokuapp.com/meanings/internet";
let method = "GET";

let xhttp = new XMLHttpRequest();
xhttp.open(method, url, true);
xhttp.onreadystatechange = () => {
  if (xhttp.readyState === 4) {
    if (xhttp.status === 200) {
      let classe = JSON.parse(xhttp.responseText);
      console.log(classe[0].class.split(' ')[0]);
    }
  }
};

xhttp.send();

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
