window.onload = inicializa;
function inicializa(){
	database = firebase.database().ref();
	document.getElementById("cuenta").addEventListener("submit",crearUsusario);

}
function crearUsusario(event){
	event.preventDefault();
	firebase.auth().createUserWithEmailAndPassword(

		event.target.email.value
		,
		event.target.pwd.value

	).catch(function(error) {
		var errorCode = error.code;
		var errorMessage = error.message;
	}).currentUser;

	var user = firebase.auth().currentUser;
	if (user != null) {
		console.log("todo bien");
		console.log(user.uid);//arreglado
		database.child("Usuarios").push({
			clave : user.uid,
			admin : false,
			Nick: document.getElementById("nick").value,
			bio: "Escribe tu biografia!!!",
			imgUrl: "nanai"
		});
		location.href = "usuario.html";
	}


}
