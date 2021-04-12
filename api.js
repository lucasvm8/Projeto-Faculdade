let url = "https://significado.herokuapp.com/livro";

let xhttp = new XMLHttpRequest();
xhttp.open("GET", url);
xhttp.onreadystatechange = () => {
  if (xhttp.readyState == 4) {
    if (xhttp.status == 200) {
      console.log(xhr.responseText);
    }
  }
};

xhttp.send();