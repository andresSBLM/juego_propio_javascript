
/*Función encargada de cargar el tablero del juego donde transcurriran todos los
acontecimientos de la partida. Devuelve un array con dos elementos,
el tablero y un array que simula la lógica del tablero, el tablero contiene todas las fichas y
recibe como parámetro el alto y ancho del tablero */

function construir_tablero(tamaño) {
    var partida = new Array(tamaño);
    var clase = 1;
    const CONTENEDOR = document.createElement("div");
    CONTENEDOR.id = "contenedor_principal";
    for (let x = 0; x < tamaño; x++) {
        for (let y = 0; y < tamaño; y++) {
            const CASILLA = document.createElement("div");
            (clase % 2 == 0) ?CASILLA.classList.add("casilla1"): CASILLA.classList.add("casilla2");
            clase++;
            CASILLA.id = "casilla";
            CONTENEDOR.appendChild(CASILLA);
        }
        clase++;
    }
    const VUELTA = [CONTENEDOR, partida];
    return VUELTA;
}