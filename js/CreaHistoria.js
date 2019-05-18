window.onload = inicializa;
var titulo, solucion, imgUrl;
function inicializa() {
	document.getElementById("formulario").addEventListener("submit",prevent);
	document.getElementById("crearHistoria").addEventListener("click",crearHistoria)
}
function prevent(event) {
	event.preventDefault();
}
function crearHistoria() {
	console.log("hola");
	firebase.database().ref().child("historias").push({
		descripcion: document.getElementById("titulo").value,
		img: "",
		solucion: document.getElementById("solucion").value + "\nCreado por: " + firebase.auth().currentUser.Nick


	});
	location.href = "usuario.html";
	console.log("adios?");
}
