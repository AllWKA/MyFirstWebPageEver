window.onload = inicializa;
window.onbeforeunload = cierra;
var chat;
var indiceHistoria;
var solucion;
var Master;
var jugadores;
var database;
var boton;
var Jugador;
var miKey;
var storage;
var mensajeEnPantalla = 0;

function inicializa() {

	database = firebase.database().ref(); // guardo una referencia a la raiz de la base de datos
	storage = firebase.storage().ref(); //guardo una referencia a la raiz del storage

	$("#pedirNombre").modal({backdrop: false}); //muestro el modal para pedirel nombre

	document.getElementById("enviarNombre").addEventListener("submit", comprobarUsuario); // creo la funcion para crear el usuario con su nombre

	chat = database.child("Salas/0/Mensajes").on("value",refrescarChat); // creo la funcion para refrescar el chat cada vez que haya un cambio en la base de datos del chat

	jugadores = database.child("Salas/0/usuarios").on("value",refresJugadores) // creo la funcion para refrescar los jugadores de la sala

	boton = document.getElementById("boton").addEventListener("submit",addMessege); // creo la funcion para añadir un mensaje al chat/base de datos

	document.getElementById("comandos").addEventListener("click",muestraComandos); // creo la funcion para mostrar el modal de la descripcion de los comandos

	database.child("Salas/0/Historias").on("value",muestraHistoria); // creo la funcion para actualizar la historia que se esta jugando

}

function actualizaNombre(snap) {
	Jugador = snap.val().nombre;
	database.child("Salas/0/Historias").once("value").then(muestraHistoria);

}

function muestraHistoria(snap){

	indiceHistoria = snap.val().actual;
	var indiceString = indiceHistoria;

	database.child("historias/" + indiceString).once("value").then( function (snap){

		document.getElementById("actual").innerHTML = "<img class = imgDesc src=" + snap.val().img + " alt = imagen de Descrición > <br>"
											 + snap.val().descripcion;

		if (Jugador != "" && Jugador.search("-Master") != -1) {
			document.getElementById("solucion").innerHTML = snap.val().solucion;
		}else{

			document.getElementById("solucion").innerHTML = "Te toca preguntar!!";

		}



	});

}

function addMessege(event){

	event.preventDefault();
	var mensaje = document.getElementById("mensaje").value.split(" ");//split nigga
	console.log(mensaje[0]);
	switch (mensaje[0]) {

		case"/elegirMaster":
		if (mensaje[1]=="lista") {
			muestraJugadores();
		} else {
			chooseMaster(mensaje[1]);
		}
		break;
		case "/limpiar":
		document.getElementById("chat").innerHTML="";
		break;
		case "/elegirHistoria":
		choosStorie(mensaje[1]);
		database.child("Salas/0/Mensajes").push({

			nombre : Jugador,
			mensaje : "He elegido la historia " + mensaje[1]

		});
		//rss
		break;
		case "/cambiarNombre":
		actualizaNick(mensaje[1]);
		break;
		case "/elegirMaster":
		chooseMaster(mensaje[1]);
		break;
		default:
		if (document.getElementById("mensaje").value == "") {
			break;
		}
		database.child("Salas/0/Mensajes").push({

			nombre : Jugador,
			mensaje : document.getElementById("mensaje").value

		});

	}
	document.getElementById("boton").reset();

}

function chooseMaster(master){
	database.child("Salas/0").once("value").then(function(snap){

		database.child("Salas/0/Mensajes").push({//en el caso de que funcionase

			nombre : "AllenWLKBOT",
			mensaje : "Cambiando el master... ahora es: ****"+ master+"****"

		});
	});
	var nuevoNombre;
	database.child("Salas/0/usuarios").once("value").then(function(snap) {
		//elimino el antiguo
		for (var variable in snap.val()) {
			nuevoNombre = snap.val()[variable].nombre;
			if (nuevoNombre.search("-Master") != -1) {
				nuevoNombre =snap.val()[variable].nombre.substring(
					0,
					snap.val()[variable].nombre.search("-Master")
				);
			}
				database.child("Salas/0/usuarios/" + variable).update({
					nombre: nuevoNombre
				});
		}
		//añado el nuevo master
		for (var variable in snap.val()) {
			nuevoNombre = snap.val()[variable].nombre;
			if (nuevoNombre.search(master) != -1) {
				nuevoNombre += "-Master";
				database.child("Salas/0/usuarios/" + variable).update({
					nombre: nuevoNombre
				})
			}
		}
	});




}

function muestraComandos(event) {
	event.preventDefault();
	$("#muestraComandos").modal({backdrop: false});
}

function actualizaNick (nuevo){

	if (Jugador == "&" || Jugador == "") {// controlar variantes de master
		alert("Nombre no válido"); //avisa al jugador de que su nombre es invalido
	}else{
		database.child("Salas/0/Mensajes").push({

			nombre : Jugador,
			mensaje : "****** Ha cambiado su nombre a: " + nuevo + " ******"

		});
		Jugador = nuevo;
		database.child("Salas/0/usuarios/"+miKey).update({
			nombre: nuevo
		});//si coincide con el formato actualiza el usuario


	}

}

function comprobarUsuario(event) {
	event.preventDefault();
	Jugador = document.getElementById("nombreJugador").value; //cojo lo que el usuario introduce

	if (Jugador == "&" || Jugador == "") {// controlar variantes de master
		alert("Nombre no válido"); //avisa al jugador de que su nombre es invalido
	}else{
		crearUsuario();//si coincide con el formato crea el usuario
	}

}

function crearUsuario() {

	miKey = database.child("Salas/0/usuarios").push( {
		nombre:Jugador
	}).key; //añado la clave y creo el usuario a la vez
	database.child("Salas/0/usuarios/"+miKey).on("value", actualizaNombre);
	$("#pedirNombre").modal("hide");
}

function refresJugadores(snap) {

	var jugadores="";

	for(var key in snap.val()){
		jugadores += "*****<strong>"+ snap.val()[key].nombre +"</strong>*****<br/>";
	}

	document.getElementById("jugadores").innerHTML = jugadores;

}

function muestraJugadores() {

	database.child("Salas/0/usuarios").once("value").then(function(snap){
		var jugadores="";

		for(var key in snap.val()){
			jugadores += "*****<strong>"+ snap.val()[key].nombre +"</strong>*****<br/>";
		}

		document.getElementById("chat").innerHTML = jugadores;

	});

}

function refrescarChat (snap){
	var mensajes = "" ;

	if(snap.numChildren()>=10){

		var borrado = false;

		for(var key in snap.val()){

			database.child("Salas/0/Mensajes/"+key).remove();

			if (snap.numChildren()<=10) {//seria mas facil con un while jejejejejejej
				break;
			}
		}
	}

	var b = 0;
	if (mensajeEnPantalla == 10) {
		//coger el valor del html y cortarlo e igualarlo
	}
	for(var key in snap.val()){ //buscar una manera q cuando se limpie por comando vaya añadiendo los ultimos mensajes añadidos solamente
		if (b == 9) {
			mensajes += "> <strong>"+ snap.val()[key].nombre +": </strong>" + snap.val()[key].mensaje+"<br/>";
			mensajeEnPantalla++;
			break;
		}
		b++;

	}
	document.getElementById("chat").innerHTML += mensajes;

}

function choosStorie(a) {

	if (a == "lista"){
		database.child("historias").once("value").then(function (snap) {
			var lista="";
			var pos = 1;
			for (var variable in snap.val()) {
				lista += "<br> "+ pos +". "+ snap.val()[variable].descripcion+"<br>";
				pos++;
			}
			database.child("Salas/0/Mensajes").push({

				nombre : "AllenWLKBOT",
				mensaje : ">"+lista

			});
		}
	)
	return null;
}

database.child("historias/"+(a-1)).once("value").then(function(snap){

	document.getElementById("actual").innerHTML = "<img class = imgDesc src=" + snap.val().img + " alt = imagen de Descrición > <br>"
		                                         + snap.val().descripcion;
	if (Jugador != "" && Jugador.search("-Master") != -1) {
		document.getElementById("solucion").innerHTML = snap.val().solucion;
	}else{

		document.getElementById("solucion").innerHTML = "Te toca preguntar!!";

	}


});
database.child("Salas/0/Historias").update({
	actual : a-1
});

}


function cierra() {
	database.child("Salas/0/usuarios/"+miKey).remove();
}
