
/*Función encargada de cargar el tablero del juego donde transcurriran todos los
acontecimientos de la partida. Devuelve un array con dos elementos,
el tablero y un array que simula la lógica del tablero, el tablero contiene todas las fichas y
recibe como parámetro el alto y ancho del tablero */

function construir_tablero() {
    var partida = [];
    var clase = 1;
    var contador = 0;
    const CONTENEDOR = document.createElement("div");
    CONTENEDOR.id = "contenedor_principal";
    for (let x = 0; x < TAMAÑO; x++) {
        var array = [];
        for (let y = 0; y < TAMAÑO; y++) {
            const CASILLA = document.createElement("div");
            (clase % 2 == 0) ?CASILLA.classList.add("casilla1"): CASILLA.classList.add("casilla2");
            clase++;
            array.push(TEXTO);
            CASILLA.classList.add("casilla");
            CASILLA.textContent = TEXTO;
            CASILLA.dataset.pos = contador;
            contador++;
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
el juego.*/


function cargar() {
    var num_array = 0;
    var num_posicion = 0;
    for (let casilla of CASILLAS) {
        if (num_posicion == TAMAÑO) {
            num_array++;
            num_posicion = 0;
        }

        const VALOR = partida[num_array][num_posicion];
        casilla.textContent = VALOR;

        if (casilla.textContent == PROTA) {
            casilla.dataset.array = num_array;
            casilla.dataset.posicion = num_posicion;
            casilla.id = "protagonista";
        }
        num_posicion++;
    }
}

//Funcion que inserta al jugador en mitad del tablero

function insertar_jugador() {
    const MITAD = (TAMAÑO / 2) - 1;
    partida[MITAD].splice(MITAD, 1, "0");
    return MITAD;
}

//Funcion que mueve la imagen del jugador para que apunte en la direccion del movimiento

function verdireccion() {
    var g;
    switch (direccion) {
        case 'norte':
            g = grados_rotacion.norte;
            protagonista.style.transform = `rotate(${g}deg)`;
            break;
        case 'sur':
            g = grados_rotacion.sur;
            protagonista.style.transform = `rotate(${g}deg)`;
            break;
        case 'este':
            g = grados_rotacion.este;
            protagonista.style.transform = `rotate(${g}deg)`;
            break;
        case 'oeste':
            g = grados_rotacion.oeste;
            protagonista.style.transform = `rotate(${g}deg)`;
            break;
    }
}

//BLOQUE ENCARGADO DE LA LÓGICA DE MOVIMIENTO DEL PERSONAJE


function mover() {
    protagonista.removeAttribute("id");
    protagonista.style.removeProperty("transform");
    partida[player_array].splice(player_position, 1, TEXTO);


    switch (direccion) {
        case 'norte':
            const NUEVO_ARRAY_N = player_array - 1;
            if (NUEVO_ARRAY_N == -1) {
                partida[player_array].splice(player_position, 1, PROTA);
                break;
            }
            partida[NUEVO_ARRAY_N].splice(player_position, 1, PROTA);
            player_array--;
            break;
        case 'sur':
            const NUEVO_ARRAY_S = player_array + 1;
            if (NUEVO_ARRAY_S == TAMAÑO) {
                partida[player_array].splice(player_position, 1, PROTA);
                break;
            }
            partida[NUEVO_ARRAY_S].splice(player_position, 1, PROTA);
            player_array++;
            break;
        case 'este':
            const NUEVA_POS_E = player_position - 1;
            console.log(NUEVA_POS_E);
            if (NUEVA_POS_E  == -1) {
                partida[player_array].splice(player_position, 1, PROTA);
                break;
            }
            partida[player_array].splice(NUEVA_POS_E, 1, PROTA);
            player_position--;
            break;
        case 'oeste':
            const NUEVA_POS_O = player_position + 1;
            console.log(NUEVA_POS_O);
            if (NUEVA_POS_O  == TAMAÑO) {
                partida[player_array].splice(player_position, 1, PROTA);
                break;
            }
            partida[player_array].splice(NUEVA_POS_O, 1, PROTA);
            player_position++;
            break;
    }

    console.log("Array: " + player_array + " Posicion: " + player_position);
    cargar();
    protagonista = document.getElementById("protagonista");
    verdireccion();
}