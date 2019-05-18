window.onload = inicio;

function inicio(){

  console.log("he cargado");

  document.getElementById("actual").addEventListener("mouseover",cambiaMensaje);

}

function cambiaMensaje(event) {
  document.getElementById("actual").innerHTML = "esto funciona loko";
}
