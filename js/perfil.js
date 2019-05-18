window.onload = inicializa ;
var storage, nick, contra, bio, imgURL, uid, clave, user;
function inicializa() {

	checkLoginStatus();

	storage = firebase.storage().ref();
	database = firebase.database().ref();
	document.getElementById("NuevaImagen").addEventListener("change",subirImagen);
	document.getElementById("CambiaNick").addEventListener("click",CambiaNick);
	// document.getElementById("CambiaContra").addEventListener("click",CambiaContra);
	document.getElementById("CambiaBio").addEventListener("click",CambiaBio);
	document.getElementById("CrearHistoria").addEventListener("click",function() {
		location.href = "historia.html";
	});

	document.getElementById("CambiaNick").addEventListener("submit",prevent)
	// document.getElementById("CambiaContra").addEventListener("submit",prevent);
	document.getElementById("CambiaBio").addEventListener("submit",prevent);
}
function subirImagen(event) {
	var img = document.getElementById("NuevaImagen").files[0];

	var task = storage.child("imgUsuarios/"+img.name).put(img);
	storage.child("imgUsuarios/"+img.name).getDownloadURL().then(function(url) {
		imgURL = url;
		database.child("Usuarios/"+clave).update({
			imgUrl : imgURL
		});
	});
	getUserInfo();





}
function CambiaBio() {
	var nuevo = document.getElementById("NuevaBio").value;
	if (nuevo!="") {
		database.child("Usuarios/"+clave).update({
			bio: nuevo
		});
	}
}
function CambiaContra() {
	var nuevo = document.getElementById("NuevaContra").value;

}

function prevent (event) {
	event.preventDefault();
}

function CambiaNick(event) {
	event.preventDefault();
	var nuevo = document.getElementById("NuevoNick").value;
	if (nuevo!="") {
		database.child("Usuarios/"+clave).update({
			Nick: nuevo
		});
	}

}

function checkLoginStatus(){
  firebase.auth().onAuthStateChanged(function(user){
    if (user) {
	 getUserInfo();
    }
});

}
function getUserInfo() {
	user = firebase.auth().currentUser;
	uid = user.uid;

	database.child("Usuarios").once("value").then(function (snap) {

		for(var key in snap.val()){
			if (snap.val()[key].clave == uid) {
				clave = key;
			}
		}

		nick = snap.val()[clave].Nick;
		bio = snap.val()[clave].bio;
		imgUrl = snap.val()[clave].imgUrl;
		console.log(snap.val()[clave].imgUrl);
		document.getElementById("fotoUsuario").setAttribute("src",snap.val()[clave].imgUrl);//no funciona
		if (snap.val()[clave].admin == true) {
			document.getElementById("CrearHistoria").className = "btn btn-primary cambimg";
		}
		document.getElementById("NuevaBio").setAttribute("value",bio);
		document.getElementById("NuevoNick").setAttribute("value",nick);
	});
}
