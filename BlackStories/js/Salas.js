window.onload = inicializa;

var database;

function inicializa() {

	database = firebase.database().ref();//hago referencia a la database

	database.child("Salas/0/Historias").on("value",mostrarHistoria); //hago referencia al nodo de historias
}


function mostrarHistoria(snap) {

	var indiceHistoria = snap.val().actual;

	var indiceString = indiceHistoria;

	database.child("historias/" + indiceHistoria).once("value").then( function (snap){

		document.getElementById("actual").innerHTML = "<img class = imgDesc src=" + snap.val().img + " alt = imagen de Descrición > <br>"
		+ snap.val().descripcion;



	});
}
