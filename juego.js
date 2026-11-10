
/*Función encargada de cargar el tablero del juego donde transcurriran todos los
acontecimientos de la partida. Devuelve un array con dos elementos,
el tablero y un array que simula la lógica del tablero, el tablero contiene todas las fichas y
recibe como parámetro el alto y ancho del tablero */

function construir_tablero(tamaño) {
    var partida = [];
    var clase = 1;
    const CONTENEDOR = document.createElement("div");
    CONTENEDOR.id = "contenedor_principal";
    for (let x = 0; x < tamaño; x++) {
        var array = [];
        for (let y = 0; y < tamaño; y++) {
            const CASILLA = document.createElement("div");
            (clase % 2 == 0) ?CASILLA.classList.add("casilla1"): CASILLA.classList.add("casilla2");
            clase++;
            array.push("*");
            CASILLA.id = "casilla";
            CASILLA.textContent = "*";
            CONTENEDOR.appendChild(CASILLA);
        }
        clase++;
        partida.push(array);
    }
    const VUELTA = [CONTENEDOR, partida];
    return VUELTA;
}

/*
Función encargada de actualizar constantemente la pantalla a partir de los eventos que transcurrenn en
el juego */


function cargar(array, tamaño, contenedor) {
    contenedor.innerHtml = "";
    var clase = 1;
    const CONTENEDOR = document.createElement("div");
    CONTENEDOR.id = "contenedor_principal";
    for (let x = 0; x < array.length; x++) {
        for (let y = 0; y < tamaño; y++) {
            const CASILLA = document.createElement("div");
            (clase % 2 == 0) ?CASILLA.classList.add("casilla1"): CASILLA.classList.add("casilla2");
            clase++;
            const ELEMENTO = array[x][y];
            CASILLA.textContent = ELEMENTO;
            CASILLA.id = "casilla";
            CONTENEDOR.appendChild(CASILLA);
        }
        clase++;
        partida.push(array);
    }
}

function insertar_jugador(tamaño, array) {
    const MITAD = (tamaño / 2) - 1;
    array[MITAD].splice(MITAD, 1, "0");
}


function asignar_clases(main) {

}
