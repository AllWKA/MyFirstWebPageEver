window.onload = inicializa;
//nanachi
var nombreNanachi = "Nanachi";
var vidaNanachi = 100;
var manaNanachi = 100;
var AdNanachi = 30;
var ApNanachi = 50;
var PVNanachi = 10;
var PMNanachi = 10;
//Mitty
var vidaMitty = 100;
var manaMitty = 100;
var AdMitty = 30;
var ApMitty = 50;
var PVMitty = 10;
var PMMitty = 10;
//quien Atacar
var sufreDano = false;
//puntos
var pts = 0;
//control del turno
var turnoMitty = false;
var nivel = 1;
//para todo el codigo: false -> mitty ; true -> nanachi
// ataque ad true----ataque magico false;




//---------------NOTAS--------------------//
//VALIDACION!!!!!//
//---------------------------------------//




async function inicializa(){

	$("#myModal").modal({backdrop: false});

	var bttAD = document.getElementById("AdNanachi").
	addEventListener("click", () => damage(false,true));

	var bttAP = document.getElementById("ApNanachi").
	addEventListener("click", () => damage(false,false));

	var bttPV  = document.getElementById("PVNanachi").
	addEventListener("click", () => heal(true));

	var bttPM = document.getElementById("PMNanachi").
	addEventListener("click", () => recovMana(true));

	var imgMitty = document.getElementById("mitty").
	addEventListener("mouseover", mittyover);

	imgMitty=document.getElementById("mitty").
	addEventListener("mouseleave", mittyout);

	document.getElementById("botton").addEventListener("click", botton);



}

async function botton (event){
	event.preventDefault()
	nombreNanachi = document.getElementById("nombre").value;
	console.log(nombreNanachi);
	if (document.getElementById("negro").checked == true) {
		console.log("yey");
		document.getElementById("juego").style.background = "black";
	}else if (document.getElementById("rojo").checked == true&&document.getElementById("azul").checked != true) {
		document.getElementById("juego").style.background ="red";

	}else if (document.getElementById("azul").checked == true&&document.getElementById("rojo").checked != true) {
		document.getElementById("juego").style.background ="blue";
	}else {
		document.getElementById("juego").style.background ="purple";
	}
	$("#myModal").modal("hide");
	Actualiza(true); //inicializa las stats
	Actualiza(false); // de las dos
	$("#tuto").modal({backdrop: false});
	await sleep(4500);
	$("#tuto").modal("hide");
}
function mittyover(event){

	var imagen = event.target;
	imagen.src = "../img/sprites/mitty.png";

}
function mittyout(event){

	var imagen = event.target;
	imagen.src = "../img/sprites/mittycurse.png";

}
function puntos(){
	pts = (nivel*(vidaNanachi+ApNanachi+AdNanachi+ApNanachi))/2;


}
function win(){
	console.log("alguien perdio");
	if (vidaMitty<=0) {
		if (nivel == 10) {
			window.confirm("Has liberado a Mitty");
			var img = document.createElement("img");
			img.src = "../img/sprites/win.png";
			img.className = "img-responsive";
			var div = document.createElement("div").appendChild(img);
			div.className = "container";
			document.getElementById("juego").innerHTML = "";
			document.getElementById("juego").appendChild(div);
		}else{
			window.confirm("Has ganado\npero no ha muerto...");
			evolucion();
		}
	}
	if (vidaNanachi <= 0) {
		window.confirm("Has muerto y Mitty se ha quedado sola");
		var img = document.createElement("img");
		img.src = "../img/sprites/lose.png";
		img.className = "img-responsive";
		var div = document.createElement("div").appendChild(img);
		div.className = "container";
		document.getElementById("juego").innerHTML = "";
		document.getElementById("juego").appendChild(div);
	}
	puntos();
}
function evolucion(){
	//reinicio

	vidaMitty = 100;
	manaMitty = 100;
	AdMitty = 30;
	ApMitty = 50;
	PVMitty = 10;
	PMMitty = 10;
	//aumento las stats tantas veces como nivel sea//
	for(var i = 0 ; i < nivel+1 ; i++){
		var inicio = false;
		if (i == 0) {
			i = 2;
			inicio = true;
		}
		vidaMitty += vidaMitty/i;
		manaMitty += manaMitty/i;
		AdMitty += AdMitty/i;
		ApMitty += ApMitty/i;
		PVMitty += PVMitty/i;
		PMMitty += PMMitty/i;
		if (inicio == true) {
			i=0;
		}

	}
	vidaNanachi = 100;
	manaNanachi = 100;
	AdNanachi = 30;
	ApNanachi = 50;
	PVNanachi = 10;
	PMNanachi = 10;
	//aumento las stats tantas veces como nivel sea//
	for(var i = 0 ; i<nivel+1;i++){
		var inicio = false;
		if (i==0) {
			i=2;
			inicio = true;
		}
		vidaNanachi += vidaNanachi/i;
		manaNanachi += manaNanachi/i;
		AdNanachi += AdNanachi/i;
		ApNanachi += ApNanachi/i;
		PVNanachi += PVNanachi/i;
		PMNanachi += PMNanachi/i;
		if (inicio==true) {
			i=0;
		}

	}
	nivel+=1;
	Actualiza(false);


}
async function IaMitty(){

	await sleep(1000);

	if (turnoMitty == true) {
		if (vidaMitty<=90){
			damage(true,true);
			turnoMitty = false;
			return null;
		}
		if (vidaMitty<=70) {
			damaged(true,false);
			turnoMitty = false;
			return null;
		}
		if (vidaMitty<=60) {
			heal(false);
			turnoMitty = false;
			return null;
		}else {
			damage(true, true);
			turnoMitty = false;
			return null;
		}
	}
	damage(true, true);
	turnoMitty = false;
}
async function damage(damaged,type){

	if(damaged==false){// recibe daño MITTY
		if (type == true) {//tipo de ataque
			vidaMitty -= AdNanachi;
			Actualiza(false);
			await sleep(1000);
			hablar("Recibo daño ad",false);
		} else {
			console.log("ataco ap");
			if (manaMitty >= (nivel*5)) {
				console.log("arriba");
				vidaMitty -= ApNanachi;
				castMana(true);
				Actualiza(false);
				await sleep(2000);
				hablar("Recibo daño ap",false);
			}else {
				console.log("abajo");
				damage(true,true);
				return null;
			}
		}
		turnoMitty =true;
		await sleep(1000);
		IaMitty();
	}else {// RECIBE DAÑO NANACHI
		if (type == true) {//tipo de ataque
			vidaNanachi -= AdMitty;
			Actualiza(true);
			await sleep(1000);
			hablar("Recibo daño ad",true)
		} else {
			vidaNanachi -= ApMitty;
			Actualiza(true);
			await sleep(1000);
			hablar("Recibo daño ap",true)
		}

	}
	win();

}
async function heal(healed){
	if(healed==false){//quien
		vidaMitty += 10;
		Actualiza(false);
		turnoMitty = false;
		await sleep(1000);
		hablar("me curo",false)
	}else if(healed == true && turnoMitty == false){//comprueba q sea el turno del jugador
		vidaNanachi += 10;
		Actualiza(true);
		await sleep(1000);
		hablar("me curo",true)
		turnoMitty = true;
		IaMitty();
	}

}

async function castMana(mananer) {
	if(mananer==false){//quien
		manaMitty -= 30;
		Actualiza(false);
		await sleep(1000);
		hablar("Gasto mana",false)
	}else {//quien
		manaNanachi -= 30;
		Actualiza(true);
		await sleep(1000);
		hablar("Gasto mana",true)
		turnoMitty = true;
	}
	IaMitty();
}

async function recovMana(mananer){
	if(mananer==false && PMMitty>0){//quien
		manaMitty += 10;
		PMMitty--;
		Actualiza(false);
		await sleep(1000);
		hablar("Uso PM",false)
		turnoMitty = false;
	}else {//quien
		manaNanachi += 10;
		PMNanachi--;
		Actualiza(true);
		await sleep(1000);
		hablar("Uso PM",true)
		turnoMitty = true;
	}
	IaMitty();
}

function Actualiza(personaje){
	if (personaje == false) {
		quien ="statsMitty";
		//limpia
		var nueva = document.createElement("div");
		var stats = document.getElementById(quien);
		document.getElementById("statsMitty").innerHTML = "";
		//actualiza vida
		var vida = document.createElement("p");
		vida.appendChild(document.createTextNode("vida: "+vidaMitty));
		nueva.appendChild(vida);
		document.getElementById(quien).appendChild(vida);

		var mana = document.createElement("p");
		mana.appendChild(document.createTextNode("mana: "+manaMitty));
		nueva.appendChild(mana);
		document.getElementById(quien).appendChild(mana);

		var ap = document.createElement("p");
		ap.appendChild(document.createTextNode("AP: "+ApMitty));
		nueva.appendChild(ap);
		document.getElementById(quien).appendChild(ap);

		var ad = document.createElement("p");
		ad.appendChild(document.createTextNode("AD: "+AdMitty));
		nueva.appendChild(ad);
		document.getElementById(quien).appendChild(ad);

		var pv = document.createElement("p");
		pv.appendChild(document.createTextNode("POCIONES V: "+PVMitty));
		nueva.appendChild(pv);
		document.getElementById(quien).appendChild(pv);

		var pm = document.createElement("p");
		pm.appendChild(document.createTextNode("POCIONES M: "+PMMitty));
		nueva.appendChild(pm);
		document.getElementById(quien).appendChild(pm);
	}else{
		quien = "statsNanachi";
		//limpia
		var nueva = document.createElement("div");
		var stats = document.getElementById(quien);
		document.getElementById("statsNanachi").innerHTML = "";
		//actualiza vida
		var nombre = document.createElement("p");
		nombre.className="name";
		nombre.appendChild(document.createTextNode(nombreNanachi));
		console.log("aqui"+nombre.value);
		nueva.appendChild(nombre);
		document.getElementById(quien).appendChild(nombre);

		var vida = document.createElement("p");
		vida.appendChild(document.createTextNode("vida: "+vidaNanachi));
		nueva.appendChild(vida);
		document.getElementById(quien).appendChild(vida);

		var mana = document.createElement("p");
		mana.appendChild(document.createTextNode("mana: "+manaNanachi));
		nueva.appendChild(mana);
		document.getElementById(quien).appendChild(mana);

		var ap = document.createElement("p");
		ap.appendChild(document.createTextNode("AP: "+ApNanachi));
		nueva.appendChild(ap);
		document.getElementById(quien).appendChild(ap);

		var ad = document.createElement("p");
		ad.appendChild(document.createTextNode("AD: "+AdNanachi));
		nueva.appendChild(ad);
		document.getElementById(quien).appendChild(ad);

		var pv = document.createElement("p");
		pv.appendChild(document.createTextNode("POCIONES V: "+PVNanachi));
		nueva.appendChild(pv);
		document.getElementById(quien).appendChild(pv);

		var pm = document.createElement("p");
		pm.appendChild(document.createTextNode("POCIONES M: "+PMNanachi));
		nueva.appendChild(pm);
		document.getElementById(quien).appendChild(pm);
	}


}

async function hablar (mnj,quien){
	if (quien == false) {
		document.getElementById("cajaMitty").innerHTML = "";
		caja = document.getElementById("cajaMitty");
	} else {
		document.getElementById("cajaNanachi").innerHTML = "";
		caja = document.getElementById("cajaNanachi");
	}
	for (var i = 0; i < mnj.length; i++) {
		await sleep(55);
		caja.innerHTML += mnj[i];
	}
}

function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));//usar esto
}
