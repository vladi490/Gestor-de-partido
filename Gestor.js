// Variables
const puntuacionA = document.getElementById('Puntuacion-a');
const puntuacionB = document.getElementById('Puntuacion-b');
const mensajePartido = document.getElementById('Mensaje-predeterminado');
const btnReiniciar = document.getElementById('Reset-boton');

const botonesAñadir = document.querySelectorAll('.Botones-sumas button');

const formJugador = document.getElementById('Formulario-jugador');
const nombreJugadorInput = document.getElementById('Jugador-nombre');
const listaJugadores = document.getElementById('Lista-jugadores');
const feedbackJugador = document.getElementById('Facilidad-jugador');

// Estado en el que esta el marcador 
let puntoA = 0;
let puntoB = 0;
const jugadores = new Set();

feedbackJugador.setAttribute('role', 'status');

//  Funciones 

function escaparTexto(texto) {
	const div = document.createElement('div');
	div.textContent = texto;
	return div.innerHTML;
}

function actualizarMarcador() {
	puntuacionA.textContent = puntoA;
	puntuacionB.textContent = puntoB;

	let msg;
	if (puntoA === 0 && puntoB === 0) {
		msg = 'Partido sin goles aún.';
	} else if (puntoA === puntoB) {
		msg = `Empate ${puntoA} - ${puntoB}.`;
	} else if (puntoA > puntoB) {
		msg = `Lidera Equipo A ${puntoA} a ${puntoB}.`;
	} else {
		msg = `Lidera Equipo B ${puntoB} a ${puntoA}.`;
	}
	
	mensajePartido.textContent = msg;
	mensajePartido.className = 'Default';
}

function mostrarAvisoJugador(texto, tipo = 'success') {
	feedbackJugador.textContent = texto;
	feedbackJugador.classList.remove('success', 'error');
	feedbackJugador.classList.add(tipo === 'error' ? 'error' : 'success');
	if (!feedbackJugador.classList.contains('Warn')) feedbackJugador.classList.add('Warn');
	feedbackJugador.style.display = 'block';
	
	clearTimeout(mostrarAvisoJugador._timeout);
	mostrarAvisoJugador._timeout = setTimeout(() => {
		feedbackJugador.style.display = 'none';
	}, 3000);
}

//  Suma del contador y demas  

botonesAñadir.forEach(btn => {
	btn.addEventListener('click', () => {
		const equipo = btn.dataset.team;
		const puntos = Number(btn.dataset.points) || 1;
		if (equipo === 'A') puntoA += puntos;
		else puntoB += puntos;
		actualizarMarcador();
	});
});

btnReiniciar.addEventListener('click', () => {
	puntoA = 0;
	puntoB = 0;
	puntuacionA.textContent = puntoA;
	puntuacionB.textContent = puntoB;
	mensajePartido.textContent = 'Marcador reiniciado.';
	mensajePartido.className = 'Default';
	clearTimeout(btnReiniciar._timeout);
	btnReiniciar._timeout = setTimeout(() => {
		actualizarMarcador();
	}, 2500);
});

//  Añadir el usuario y que te salgan mensajes en casoo de que ya exista y uso del boton eliminar para borrar usuario 

formJugador.addEventListener('submit', (e) => {
	e.preventDefault();
	const nombreCrudo = nombreJugadorInput.value.trim();
	
	if (!nombreCrudo) {
		mostrarAvisoJugador('El nombre no puede estar vacío.', 'error');
		nombreJugadorInput.focus();
		return;
	}
	
	const clave = nombreCrudo.toLowerCase();
	if (jugadores.has(clave)) {
		mostrarAvisoJugador('El jugador ya existe.', 'error');
		nombreJugadorInput.select();
		return;
	}
	
	jugadores.add(clave);
	const li = document.createElement('li');
	li.dataset.key = clave;
	li.innerHTML = `<span>${escaparTexto(nombreCrudo)}</span><button class="Boton-eliminar" aria-label="Eliminar ${escaparTexto(nombreCrudo)}">Eliminar</button>`;
	listaJugadores.appendChild(li); 
	mostrarAvisoJugador(`Jugador "${nombreCrudo}" añadido.`, 'success');
	nombreJugadorInput.value = '';
	nombreJugadorInput.focus();
});

listaJugadores.addEventListener('click', (e) => {
	if (e.target && e.target.matches('button.Boton-eliminar')) {
		const li = e.target.closest('li');
		const clave = li.dataset.key;
		const nombre = li.querySelector('span')?.textContent || clave;
		jugadores.delete(clave);
		li.remove();
		mostrarAvisoJugador(`Jugador "${nombre}" eliminado.`, 'success');
	}
});

//  Acualizar el marcador  

actualizarMarcador();