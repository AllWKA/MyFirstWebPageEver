window.onload = inicializa;

function inicializa() {
	document.getElementById("autent").addEventListener("submit",iniciaUsuario);
}
function iniciaUsuario(event) {
	event.preventDefault();
	var email = document.getElementById("email").value;
	var password = document.getElementById("pwd").value;
	console.log("estamos aquí");
	var user = firebase.auth().signInWithEmailAndPassword(email, password)
	.then(function(usuario){
		// if (user != null) {
			console.log("todo bien");
			// console.log(user.uid);//arreglado
			console.log("autenticado etoy");
			location.href = "usuario.html";
		// }
	})
	.catch(function(error) {
	  // Handle Errors here.
	  var errorCode = error.code;
	  var errorMessage = error.message;
	  console.log(error);
	  // ...
	});



}
