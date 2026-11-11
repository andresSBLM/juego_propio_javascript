
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
            (clase % 2 == 0) ? CASILLA.classList.add("casilla1") : CASILLA.classList.add("casilla2");
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
        casilla.dataset.ejex = num_posicion;
        casilla.dataset.ejey = num_array;

        switch (casilla.textContent) {
            case PROTA:
                casilla.id = "protagonista";
                break;
            case FUEGO:
                casilla.classList.add("fuego");
                break;
            case PISTOLA:
                casilla.id = "pistola";
                break;
        }
        num_posicion++;
    }
}

//Funcion que inserta al jugador en mitad del tablero

function insertar_jugador() {
    partida[MITAD].splice(MITAD, 1, PROTA);
    return MITAD;
}

//Función que inserta el primer incendio en el juego

function insertar_fuego() {
    const EJE_X = TAMAÑO - 1;
    const EJE_Y = 0;
    partida[EJE_Y].splice(EJE_X, 1, FUEGO);
    pos_fuego_inicio = [EJE_X, EJE_Y];
    CASILLAS_QUEMADAS.textContent = 1;
    CASILLAS_RESTANTES.textContent = casillas_restantes - 1;
}

//Función que inserta la pistola de agua 

function insertar_pistola() {
    const array_random = Math.round(Math.random() * (TAMAÑO - 1));
    const posicion_random = Math.round(Math.random() * (MITAD - 1));
    if (partida[array_random][posicion_random] == TEXTO) {
        partida[array_random][posicion_random] = PISTOLA;
    } else {
        insertar_pistola();
        return;
    }
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

//Funcion encargada de comprobar y devolver que hay delante del proximo movimiento

function verdelante(ejex, ejey) {
    var avanzar = true;
    const OBJETO = partida[ejey][ejex];
    console.log(ejex);
    console.log(ejey);
    const ELEMENTO = document.querySelector(`[data-ejex="${ejex}"][data-ejey="${ejey}"]`)
    switch (OBJETO) {
        case FUEGO:
            avanzar = false;
            break;
        case PISTOLA:
            avanzar = false;
            ELEMENTO.removeAttribute("id");
            ELEMENTO.textContent = TEXTO;
            partida[ejey][ejex] = TEXTO;
            inventario.pistola = objetos.pistola;
            cargar_inventario();
            break;

    }
    if (avanzar) {
        texto_pisado = OBJETO;
    }
    return avanzar;
}

//BLOQUE ENCARGADO DE LA LÓGICA DE MOVIMIENTO DEL PERSONAJE


function mover() {
    protagonista = document.getElementById("protagonista");
    protagonista.removeAttribute("id");
    protagonista.style.removeProperty("transform");
    partida[player_array].splice(player_position, 1, texto_pisado);


    switch (direccion) {
        case 'norte':
            const NUEVO_ARRAY_N = player_array - 1;
            if (NUEVO_ARRAY_N == -1 || !(verdelante(player_position, NUEVO_ARRAY_N))) {
                partida[player_array].splice(player_position, 1, PROTA);
                break;
            }
            partida[NUEVO_ARRAY_N].splice(player_position, 1, PROTA);
            player_array--;
            break;
        case 'sur':
            const NUEVO_ARRAY_S = player_array + 1;
            if (NUEVO_ARRAY_S == TAMAÑO || !(verdelante(player_position, NUEVO_ARRAY_S))) {
                partida[player_array].splice(player_position, 1, PROTA);
                break;
            }
            partida[NUEVO_ARRAY_S].splice(player_position, 1, PROTA);
            player_array++;
            break;
        case 'este':
            const NUEVA_POS_E = player_position - 1;
            if (NUEVA_POS_E == -1 || !(verdelante(NUEVA_POS_E, player_array))) {
                partida[player_array].splice(player_position, 1, PROTA);
                break;
            }
            partida[player_array].splice(NUEVA_POS_E, 1, PROTA);
            player_position--;
            break;
        case 'oeste':
            const NUEVA_POS_O = player_position + 1;
            console.log(NUEVA_POS_O);
            if (NUEVA_POS_O == TAMAÑO || !(verdelante(NUEVA_POS_O, player_array))) {
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

document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowUp':
        case 'w':
            direccion = 'norte';
            console.log("Moviendo hacia " + direccion)
            mover();
            break;
        case 'ArrowDown':
        case 's':
            direccion = 'sur';
            console.log("Moviendo hacia " + direccion)
            mover();
            break;
        case 'ArrowLeft':
        case 'a':
            direccion = 'este';
            console.log("Moviendo hacia " + direccion)
            mover();
            break;
        case 'ArrowRight':
        case 'd':
            direccion = 'oeste';
            console.log("Moviendo hacia " + direccion)
            mover();
            break;
        case '1':
            if (Object.keys(inventario).length !== 0) {
                if (!equipado) {
                    SLOTS_INVENTARIO[0].classList.add("equipado");
                    equipado = Object.keys(inventario)[0];
                } else {
                    if (SLOTS_INVENTARIO[0].classList.contains("equipado")){
                        SLOTS_INVENTARIO[0].classList.remove("equipado");
                        equipado = "";
                    } else {
                        alert(5);
                        const SLOT_EQUIPADO = document.getElementsByClassName("equipado");
                        SLOT_EQUIPADO.classList.remove("equipado");
                        SLOTS_INVENTARIO[0].classList.add("equipado");
                        equipado = Object.keys(inventario)[0];
                    }
                }
            }
    }
});

//Encargado de detectar cuando el arma puede dispararse

document.addEventListener('click', () => {
    if (equipado == "pistola") {
        const PRINCIPAL = document.getElementById("protagonista");
        const ARRAY_ACTUAL = PRINCIPAL.dataset.ejey;
        const POSICION_ACTUAL = PRINCIPAL.dataset.ejex;
        var tempo = 1;
        switch (direccion) {
            case 'norte':
                const NUEVO_ARRAY_N = ARRAY_ACTUAL - 1;
                partida[NUEVO_ARRAY_N][POSICION_ACTUAL] = BALA;
                const ELEMENTO = document.querySelector(`[data-ejex="${POSICION_ACTUAL}"][data-ejey="${NUEVO_ARRAY_N}"]`);

                tempo++;
                break;
        }
    }
});


//Funcion encargada de mover la bala


//Función encargada de esparcir el incendio

function esparcir_fuego(ejex, ejey) {
    setInterval(() => {
        for (let x = -1; x <= 1; x++) {
            for (let y = -1; y <= 1; y++) {
                if ((x == -1 && y == -1) || (x == 1 && y == 1) || (x == -1 && y == 1) || (x == 1 && y == -1)){
                    continue;
                }
                const ELEMENTO = document.querySelector(`[data-ejex="${ejex + x}"][data-ejey="${ejey + y}"]`);
                if (ELEMENTO && !ELEMENTO.dataset.visto) {
                    if (ELEMENTO.textContent == PROTA) {
                        partida[ejey + y].splice(ejex + x, 1, FUEGO);
                        ELEMENTO.removeAttribute("id");
                        ELEMENTO.style.removeProperty("transform");
                        direccion = 'norte';
                        if (casillas_quemadas >= 170) {
                            partida[TAMAÑO - 1][0] = PROTA;
                            player_array = TAMAÑO - 1;
                            player_position = 0;
                            
                        } else {
                            partida[MITAD][MITAD] = PROTA;
                            player_array = MITAD;
                            player_position = MITAD;
                        }
                    }
                    if(ELEMENTO.textContent == PISTOLA) {
                        ELEMENTO.textContent = TEXTO;
                        ELEMENTO.removeAttribute("id");
                        insertar_pistola();
                    }
                    ELEMENTO.dataset.visto = "visto";
                    ELEMENTO.textContent = FUEGO;
                    partida[ejey + y][ejex + x] = FUEGO;
                    casillas_quemadas++;
                    casillas_restantes--;
                    CASILLAS_QUEMADAS.textContent = casillas_quemadas;
                    CASILLAS_RESTANTES.textContent = casillas_restantes;
                    esparcir_fuego(ejex + x, ejey + y);
                }
            }
        }
        cargar();
    }, 2000);
}


//Funcion encargada de gestionar el inventario

function cargar_inventario(){
    for (let x = 0; x < Object.keys(inventario).length; x++) {
        const CLAVE = Object.keys(inventario)[x];
        const RUTA = inventario[CLAVE];
        const ELEMENTO = FOTOS_INVENTARIO[x];
        ELEMENTO.classList.add("foto_objeto");
        ELEMENTO.src = RUTA;
    }
}