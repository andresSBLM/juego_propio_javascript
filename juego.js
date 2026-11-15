
/*Función encargada de cargar el tablero del juego donde transcurriran todos los
acontecimientos de la partida. Devuelve un array con dos elementos,
el tablero y un array que simula la lógica del tablero, el tablero contiene todas las fichas y
recibe como parámetro el alto y ancho del tablero */

function construir_tablero() {
    var partida = [];
    var clase = 1;
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
            case ENEMIGO:
                casilla.classList.add("enemigo");
        }
        num_posicion++;
    }
}

//Funcion que inserta al jugador en mitad del tablero

function insertar_jugador() {
    partida[MITAD].splice(MITAD, 1, PROTA);
}

//Funcion encargada de spawnear al jugador tras morir

function spawnear_jugador() {
    cargar();
    const LUGARES_DISPONIBLES = document.querySelectorAll(".casilla:not(.fuego):not([id])");
    if (!LUGARES_DISPONIBLES) return;
    const NUM_RANDOM = Math.floor(Math.random() * (LUGARES_DISPONIBLES.length - 1));
    const LUGAR_RANDOM = LUGARES_DISPONIBLES[NUM_RANDOM];
    const EJE_Y = parseInt(LUGAR_RANDOM.dataset.ejey);
    const EJE_X = parseInt(LUGAR_RANDOM.dataset.ejex);
    partida[EJE_Y].splice(EJE_X, 1, PROTA);
    player_array = EJE_Y;
    player_position = EJE_X;
    cargar();
}

//Función que inserta un incendio en una esquina aleatoria del juego

function insertar_fuego() {
    const ESQUINA = Math.floor(Math.random() * 4);
    var ejex;
    var ejey;
    switch (ESQUINA) {
        case 0:
            ejex = 0;
            ejey = 0;
            break;
        case 1:
            ejex = 0;
            ejey = TAMAÑO - 1;
            break;
        case 2:
            ejex = TAMAÑO - 1;
            ejey = 0;
            break;
        case 3:
            ejex = TAMAÑO - 1;
            ejey = TAMAÑO - 1;
            break;
    }
    partida[ejey].splice(ejex, 1, FUEGO);
    pos_fuego_inicio = [ejex, ejey];
    const ELEMENTO = conseguir_elemento(ejex, ejey);
    ELEMENTO.dataset.visto = "visto";
    sumar_fuego();
}


//Función que inserta la pistola de agua 

function insertar_pistola() {
    const array_random = Math.round(Math.random() * (TAMAÑO - 1));
    const posicion_random = Math.round(Math.random() * (TAMAÑO - 1));
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
    const ELEMENTO = conseguir_elemento(ejex, ejey);
    switch (OBJETO) {
        case FUEGO:
            avanzar = false;
            vida--;
            comprobar_vida();
            break;
        case PISTOLA:
            avanzar = false;
            ELEMENTO.removeAttribute("id");
            ELEMENTO.textContent = TEXTO;
            partida[ejey][ejex] = TEXTO;
            inventario.pistola = objetos.pistola;
            cargar_inventario();
            insertar_fuego();
            esparcir_fuego();
            break;
        case BALA:
            avanzar = false;
        case ENEMIGO:
            avanzar = false;
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
    if (vida > 0) {

        switch (event.key) {
            case 'ArrowUp':
            case 'w':
            case 'W':
                direccion = 'norte';
                console.log("Moviendo hacia " + direccion)
                mover();
                break;
            case 'ArrowDown':
            case 's':
            case 'S':
                direccion = 'sur';
                console.log("Moviendo hacia " + direccion)
                mover();
                break;
            case 'ArrowLeft':
            case 'a':
            case 'A':
                direccion = 'este';
                console.log("Moviendo hacia " + direccion)
                mover();
                break;
            case 'ArrowRight':
            case 'd':
            case 'D':
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
                        if (SLOTS_INVENTARIO[0].classList.contains("equipado")) {
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
    }
});

//Encargado de detectar cuando el arma puede dispararse

document.addEventListener('click', () => {
    const ahora = Date.now();
    if (ahora - ultimo_click < COOLDOWN_CLICK || vida <= 0) return;
    ultimo_click = ahora;

    if (equipado == "pistola") {
        crear_bala();
    }
});

document.addEventListener('keydown', (event) => {
    if (vida <= 0) return;
    switch (event.key) {
        case 'q':
        case 'Q':
            if (equipado == "pistola") {
                crear_bala();
            }
            break;
        case ' ':
            velocidad_fuego = 10000;
            velocidad_enemigo = 10000;
            ratio_spawneo = 10;
    }
});

//Funcion que crea la bala

function crear_bala() {
    const PRINCIPAL = document.getElementById("protagonista");
    const ARRAY_ACTUAL = parseInt(PRINCIPAL.dataset.ejey);
    const POSICION_ACTUAL = parseInt(PRINCIPAL.dataset.ejex);
    if (
        (ARRAY_ACTUAL == (TAMAÑO - 1) && direccion == "sur") ||
        (ARRAY_ACTUAL == 0 && direccion == "norte") ||
        (POSICION_ACTUAL == (TAMAÑO - 1) && direccion == "oeste") ||
        (POSICION_ACTUAL == 0 && direccion == "este")
    ) return;
    switch (direccion) {
        case 'norte':
            const NUEVO_ARRAY_N = ARRAY_ACTUAL - 1;
            const ELEMENTO_N = conseguir_elemento(POSICION_ACTUAL, NUEVO_ARRAY_N);
            if (ELEMENTO_N) {
                if (partida[NUEVO_ARRAY_N][POSICION_ACTUAL] == FUEGO) {
                    ELEMENTO_N.removeAttribute("data-visto");
                    ELEMENTO_N.classList.remove("fuego");
                    partida[NUEVO_ARRAY_N].splice(POSICION_ACTUAL, 1, TEXTO);
                    restar_fuego();
                    cargar();
                    return;
                } else if (partida[NUEVO_ARRAY_N][POSICION_ACTUAL] == ENEMIGO) {
                    ELEMENTO_N.removeAttribute("id");
                    ELEMENTO_N.classList.remove("enemigo");
                    ELEMENTO_N.style.removeProperty("transform");
                    partida[NUEVO_ARRAY_N].splice(POSICION_ACTUAL, 1, FUEGO);
                    ELEMENTO_N.classList.add("fuego");
                    ELEMENTO_N.dataset.visto = "visto";
                    cargar();
                    return;
                }
                partida[NUEVO_ARRAY_N][POSICION_ACTUAL] = BALA;
                ELEMENTO_N.id = "bala" + id_bala;
                cargar();
                mover_bala(id_bala, POSICION_ACTUAL, NUEVO_ARRAY_N);
                id_bala++;
                break;
            }
        case 'sur':
            const NUEVO_ARRAY_S = ARRAY_ACTUAL + 1;
            const ELEMENTO_S = conseguir_elemento(POSICION_ACTUAL, NUEVO_ARRAY_S);
            if (ELEMENTO_S) {
                if (partida[NUEVO_ARRAY_S][POSICION_ACTUAL] == FUEGO) {
                    ELEMENTO_S.removeAttribute("data-visto");
                    ELEMENTO_S.classList.remove("fuego");
                    partida[NUEVO_ARRAY_S].splice(POSICION_ACTUAL, 1, TEXTO);
                    restar_fuego();
                    cargar();
                    return;
                } else if (partida[NUEVO_ARRAY_S][POSICION_ACTUAL] == ENEMIGO) {
                    ELEMENTO_S.removeAttribute("id");
                    ELEMENTO_S.classList.remove("enemigo");
                    ELEMENTO_S.style.removeProperty("transform");
                    partida[NUEVO_ARRAY_S].splice(POSICION_ACTUAL, 1, FUEGO);
                    ELEMENTO_S.classList.add("fuego");
                    ELEMENTO_S.dataset.visto = "visto";
                    cargar();
                    return;
                }
                partida[NUEVO_ARRAY_S][POSICION_ACTUAL] = BALA;
                ELEMENTO_S.id = "bala" + id_bala;
                cargar();
                mover_bala(id_bala, POSICION_ACTUAL, NUEVO_ARRAY_S);
                id_bala++;
                break;
            }

        case 'este':
            const NUEVO_ANCHO_E = POSICION_ACTUAL - 1;
            const ELEMENTO_E = conseguir_elemento(NUEVO_ANCHO_E, ARRAY_ACTUAL);
            if (ELEMENTO_E) {
                if (partida[ARRAY_ACTUAL][NUEVO_ANCHO_E] == FUEGO) {
                    ELEMENTO_E.removeAttribute("data-visto");
                    ELEMENTO_E.classList.remove("fuego");
                    partida[ARRAY_ACTUAL].splice(NUEVO_ANCHO_E, 1, TEXTO);
                    cargar();
                    restar_fuego();
                    return;
                } else if (partida[ARRAY_ACTUAL][NUEVO_ANCHO_E] == ENEMIGO) {
                    ELEMENTO_E.removeAttribute("id");
                    ELEMENTO_E.classList.remove("enemigo");
                    ELEMENTO_E.style.removeProperty("transform");
                    partida[ARRAY_ACTUAL].splice(NUEVO_ANCHO_E, 1, FUEGO);
                    ELEMENTO_E.classList.add("fuego");
                    ELEMENTO_E.dataset.visto = "visto";
                    cargar();
                    return;
                }
                partida[ARRAY_ACTUAL][NUEVO_ANCHO_E] = BALA;
                ELEMENTO_E.id = "bala" + id_bala;
                cargar();
                mover_bala(id_bala, NUEVO_ANCHO_E, ARRAY_ACTUAL);
                id_bala++;
                break;
            }

        case 'oeste':
            const NUEVO_ANCHO_O = POSICION_ACTUAL + 1;
            const ELEMENTO_O = conseguir_elemento(NUEVO_ANCHO_O, ARRAY_ACTUAL);
            if (ELEMENTO_O) {
                if (partida[ARRAY_ACTUAL][NUEVO_ANCHO_O] == FUEGO) {
                    ELEMENTO_O.removeAttribute("data-visto");
                    ELEMENTO_O.classList.remove("fuego");
                    partida[ARRAY_ACTUAL].splice(NUEVO_ANCHO_O, 1, TEXTO);
                    cargar();
                    restar_fuego();
                    return;
                } else if (partida[ARRAY_ACTUAL][NUEVO_ANCHO_O] == ENEMIGO) {
                    ELEMENTO_O.removeAttribute("id");
                    ELEMENTO_O.classList.remove("enemigo");
                    ELEMENTO_O.style.removeProperty("transform");
                    partida[ARRAY_ACTUAL].splice(NUEVO_ANCHO_O, 1, FUEGO);
                    ELEMENTO_O.classList.add("fuego");
                    ELEMENTO_O.dataset.visto = "visto";
                    cargar();
                    return;
                }
                partida[ARRAY_ACTUAL][NUEVO_ANCHO_O] = BALA;
                ELEMENTO_O.id = "bala" + id_bala;
                cargar();
                mover_bala(id_bala, NUEVO_ANCHO_O, ARRAY_ACTUAL);
                id_bala++;
                break;
            }
    }
}

//Funcion encargada de mover la bala

function mover_bala(id, ejex, ejey) {
    var clase = 1;
    var movimiento = true;
    partida[ejey].splice(ejex, 1, TEXTO);
    switch (direccion) {
        case 'norte':
            for (let x = 0; x < TAMAÑO; x++) {
                setTimeout(() => {
                    const EL_BALA = document.getElementById("bala" + id);
                    if (!movimiento) return;
                    if (!EL_BALA) {
                        movimiento = false;
                        return;
                    }
                    if (!verdelante_bala(ejex, ejey - x, ejex, ejey - x + 1)) {
                        movimiento = false;
                        return;
                    }
                    EL_BALA.classList.remove("bala1", "bala2", "bala3", "bala4");
                    EL_BALA.removeAttribute("id");
                    const ELEMENTO = conseguir_elemento(ejex, ejey - x);
                    if (ELEMENTO) {
                        ELEMENTO.id = "bala" + id;
                        if (clase == 5) {
                            clase = 1;
                        }
                        ELEMENTO.classList.add("bala" + clase);
                        partida[ejey - x].splice(ejex, 1, BALA);
                        if (!(partida[ejey - x + 1][ejex] == PROTA)) {
                            partida[ejey - x + 1].splice(ejex, 1, TEXTO);
                        }
                        clase++;
                        cargar();
                    }

                }, VELOCIDAD_BALA * x);
            }
            break;


        case 'sur':
            for (let x = 0; x < TAMAÑO; x++) {
                setTimeout(() => {
                    const EL_BALA = document.getElementById("bala" + id);
                    if (!movimiento) return;
                    if (!EL_BALA) {
                        movimiento = false;
                        return;
                    }
                    if (!verdelante_bala(ejex, ejey + x, ejex, ejey + x - 1)) {
                        movimiento = false;
                        return;
                    }
                    EL_BALA.classList.remove("bala1", "bala2", "bala3", "bala4");
                    EL_BALA.removeAttribute("id");
                    const ELEMENTO = conseguir_elemento(ejex, ejey + x);
                    if (ELEMENTO) {
                        ELEMENTO.id = "bala" + id;
                        if (clase == 5) {
                            clase = 1;
                        }
                        ELEMENTO.classList.add("bala" + clase);
                        partida[ejey + x].splice(ejex, 1, BALA);
                        if (!(partida[ejey + x - 1][ejex] == PROTA)) {
                            partida[ejey + x - 1].splice(ejex, 1, TEXTO);
                        }
                        clase++;
                        cargar();
                    }

                }, VELOCIDAD_BALA * x);
            }
            break;


        case 'este':
            for (let x = 0; x < TAMAÑO; x++) {
                setTimeout(() => {
                    const EL_BALA = document.getElementById("bala" + id);
                    if (!movimiento) return;
                    if (!EL_BALA) {
                        movimiento = false;
                        return;
                    }
                    if (!verdelante_bala(ejex - x, ejey, ejex - x + 1, ejey)) {
                        movimiento = false;
                        return;
                    }

                    EL_BALA.classList.remove("bala1", "bala2", "bala3", "bala4");
                    EL_BALA.removeAttribute("id");
                    const ELEMENTO = conseguir_elemento(ejex - x, ejey);
                    if (ELEMENTO) {
                        ELEMENTO.id = "bala" + id;
                        if (clase == 5) {
                            clase = 1;
                        }
                        ELEMENTO.classList.add("bala" + clase);
                        partida[ejey].splice(ejex - x, 1, BALA);
                        if (!(partida[ejey][ejex - x + 1] == PROTA)) {
                            partida[ejey].splice(ejex - x + 1, 1, TEXTO);
                        }
                        clase++;
                        cargar();
                    }

                }, VELOCIDAD_BALA * x);
            }
            break;


        case 'oeste':
            for (let x = 0; x < TAMAÑO; x++) {
                setTimeout(() => {
                    const EL_BALA = document.getElementById("bala" + id);
                    if (!movimiento) return;
                    if (!EL_BALA) {
                        movimiento = false;
                        return;
                    }
                    if (!verdelante_bala(ejex + x, ejey, ejex + x - 1, ejey)) {
                        movimiento = false;
                        return;
                    }

                    EL_BALA.classList.remove("bala1", "bala2", "bala3", "bala4");
                    EL_BALA.removeAttribute("id");
                    const ELEMENTO = conseguir_elemento(ejex + x, ejey);
                    if (ELEMENTO) {
                        ELEMENTO.id = "bala" + id;
                        if (clase == 5) {
                            clase = 1;
                        }
                        ELEMENTO.classList.add("bala" + clase);
                        partida[ejey].splice(ejex + x, 1, BALA);
                        if (!(partida[ejey][ejex + x - 1] == PROTA)) {
                            partida[ejey].splice(ejex + x - 1, 1, TEXTO);
                        }
                        clase++
                        cargar();
                    }

                }, VELOCIDAD_BALA * x);
            }
            break;
    }
}

//Funcion encargada de ver que hay delante de la bala 

function verdelante_bala(nuevo_ejex, nuevo_ejey, ejex, ejey) {
    if (nuevo_ejex < TAMAÑO && nuevo_ejex >= 0 && nuevo_ejey < TAMAÑO && nuevo_ejey >= 0) {
        const ELEMENTO = conseguir_elemento(ejex, ejey);
        const ELEMENTO_NUEVO = conseguir_elemento(nuevo_ejex, nuevo_ejey);
        if (partida[nuevo_ejey][nuevo_ejex] == FUEGO) {
            ELEMENTO.classList.remove("bala1", "bala2", "bala3", "bala4");
            ELEMENTO_NUEVO.classList.remove("fuego");
            ELEMENTO_NUEVO.removeAttribute("data-visto");
            partida[nuevo_ejey].splice(nuevo_ejex, 1, TEXTO);
            restar_fuego();
            cambiar_fondo();
            cargar();
            return false;
        } else if (partida[nuevo_ejey][nuevo_ejex] == ENEMIGO) {
            ELEMENTO.classList.remove("bala1", "bala2", "bala3", "bala4");
            ELEMENTO.removeAttribute("id");
            ELEMENTO_NUEVO.classList.remove("enemigo");
            ELEMENTO_NUEVO.removeAttribute("id");
            ELEMENTO_NUEVO.style.removeProperty("transform");
            ELEMENTO_NUEVO.dataset.visto = "visto";
            ELEMENTO_NUEVO.classList.add("fuego");
            partida[ejey].splice(ejex, 1, TEXTO);
            partida[nuevo_ejey].splice(nuevo_ejex, 1, FUEGO);
            enemigos_derrotados++;
            ENEMIGOS.textContent = enemigos_derrotados;
            cambiar_fondo();
            cargar();
            return false;
        }
        cargar();
        return true;

    } else {
        (partida[ejey][ejex] == FUEGO) ? partida[ejey].splice(ejex, 1, FUEGO) : partida[ejey].splice(ejex, 1, TEXTO);
        const ULTIMO_ELEMENTO = document.querySelector(`[data-ejex="${ejex}"][data-ejey="${ejey}"]`);
        ULTIMO_ELEMENTO.removeAttribute("id");
        ULTIMO_ELEMENTO.classList.remove("bala1", "bala2", "bala3", "bala4");
        cargar();
    }
}

//Función encargada de esparcir el incendio

function esparcir_fuego() {
    setTimeout(() => {
        var daño = false;
        const ELEMENTOS = document.getElementsByClassName("fuego");
        for (let elemento of ELEMENTOS) {
            var ejex = parseInt(elemento.dataset.ejex);
            var ejey = parseInt(elemento.dataset.ejey);
            for (let x = -1; x <= 1; x++) {
                for (let y = -1; y <= 1; y++) {
                    if ((x == -1 && y == -1) || (x == 1 && y == 1) || (x == -1 && y == 1) || (x == 1 && y == -1)) {
                        continue;
                    }
                    const ELEMENTO = conseguir_elemento(ejex + x, ejey + y);
                    if (ELEMENTO) {
                        if (!ELEMENTO.dataset.visto) {
                            if (partida[ejey + y][ejex + x] == PROTA) {
                                partida[ejey + y].splice(ejex + x, 1, FUEGO);
                                ELEMENTO.removeAttribute("id");
                                ELEMENTO.style.removeProperty("transform");
                                ELEMENTO.dataset.visto = "visto";
                                direccion = 'norte';
                                daño = true;
                                sumar_fuego();
                                spawnear_jugador();
                                continue;
                            }
                            else if (partida[ejey + y][ejex + x] == BALA) {
                                ELEMENTO.textContent = TEXTO;
                                ELEMENTO.removeAttribute("id");
                                ELEMENTO.classList.remove("bala1", "bala2", "bala3", "bala4");
                            } else if (partida[ejey + y][ejex + x] == ENEMIGO) {
                                continue;
                            }
                            ELEMENTO.textContent = FUEGO;
                            ELEMENTO.dataset.visto = "visto";
                            partida[ejey + y][ejex + x] = FUEGO;
                            sumar_fuego();
                        }
                    }

                }
            }
        }
        if (daño) {
            vida--;
            comprobar_vida();
            daño = false;
        }
        cambiar_fondo();
        cargar();
        esparcir_fuego();
    }, velocidad_fuego);
}

//Funcion encargada de cambiar el fondo segun el estado de las casillas

function cambiar_fondo() {
    const FONDO = document.getElementById("body");
    if (casillas_quemadas > 350) {
        FONDO.style.background = "linear-gradient(rgba(248, 8, 8, 0.81),rgba(255, 123, 0, 0.81),rgba(252, 227, 1, 0.87)) , url(../img/fondowebp.webp)";
        FONDO.style.backgroundPosition = "center";
        FONDO.style.backgroundSize = "cover";
        return;
    }
    if (casillas_quemadas > 300) {
        FONDO.style.background = "linear-gradient(rgba(214, 26, 26, 0.73),rgba(214, 112, 17, 0.8),rgba(231, 210, 20, 0.74)) , url(../img/fondowebp.webp)";
        FONDO.style.backgroundPosition = "center";
        FONDO.style.backgroundSize = "cover";
        return;
    }
    if (casillas_quemadas > 200) {
        FONDO.style.background = "linear-gradient(rgba(212, 43, 43, 0.57),rgba(214, 112, 17, 0.62),rgba(231, 210, 20, 0.6)) , url(../img/fondowebp.webp)";
        FONDO.style.backgroundPosition = "center";
        FONDO.style.backgroundSize = "cover";
        return;
    }
    if (casillas_quemadas > 100) {
        FONDO.style.background = "linear-gradient(rgba(255, 83, 83, 0.464),rgba(214, 112, 17, 0.46),rgba(231, 210, 20, 0.46)) , url(../img/fondowebp.webp)";
        FONDO.style.backgroundPosition = "center";
        FONDO.style.backgroundSize = "cover";
        return;
    }
    FONDO.style.background = "linear-gradient(rgba(255, 255, 255, 0.464), rgba(0, 128, 0, 0.53)), url(../img/fondowebp.webp)";
    FONDO.style.backgroundPosition = "center";
    FONDO.style.backgroundSize = "cover";

}

//Funcion encargada de comprobar la vida 

function comprobar_vida() {
    BARRA_DE_VIDA.removeAttribute("class");
    if (vida < 0) {
        BARRA_DE_VIDA.classList.add("barra0");
    }
    switch (vida) {
        case 3:
            BARRA_DE_VIDA.classList.add("barra3");
            break;
        case 2:
            BARRA_DE_VIDA.classList.add("barra2");
            break;
        case 1:
            BARRA_DE_VIDA.classList.add("barra1");
            break;
        case 0:
            BARRA_DE_VIDA.classList.add("barra0");
            setTimeout(() => {
                alert("Has perdido");
                window.location.href = "index.html";
            }, 1000);
            break;
    }
}

//Funcion encargada de gestionar la victoria

function victoria() {
    if (casillas_quemadas == 0 && casillas_restantes >= (TAMAÑO * TAMAÑO)) {
        setTimeout(() => {
            alert("Felicidades conseguiste apagar el incendio");
            window.location.href = "index.html";
        }, 1000);
    }
}

function derrota() {
    if (casillas_quemadas == (TAMAÑO * TAMAÑO) && casillas_restantes == 0) {
        setTimeout(() => {
            alert("No pudiste contener el incendio");
            window.location.href = "index.html";
        }, 1000);
    }
}


//Funcion encargada de gestionar el inventario

function cargar_inventario() {
    for (let x = 0; x < Object.keys(inventario).length; x++) {
        const CLAVE = Object.keys(inventario)[x];
        const RUTA = inventario[CLAVE];
        const ELEMENTO = FOTOS_INVENTARIO[x];
        ELEMENTO.classList.add("foto_objeto");
        ELEMENTO.src = RUTA;
    }
}


//Función encargada de avanzar el tiempo de juego 

function avanzar_tiempo() {

    setTimeout(() => {
        tiempo_de_juego++;
        TIEMPO.textContent = tiempo_de_juego;
        if (tiempo_de_juego % ratio_spawneo == 0 && Object.keys(inventario).length !== 0) {
            spawnear_enemigo();
        }
        avanzar_tiempo();
    }, 1000);
}

//Funcion que spawnea un enemigo 

function spawnear_enemigo() {
    if (casillas_quemadas >= 300) return;
    sumar_fuego();
    const LUGARES_DISPONIBLES = document.querySelectorAll(".casilla:not(.fuego):not([id])");
    const NUM_RANDOM = Math.round(Math.random() * (LUGARES_DISPONIBLES.length - 1));
    const LUGAR_RANDOM = LUGARES_DISPONIBLES[NUM_RANDOM];
    const EJE_Y = parseInt(LUGAR_RANDOM.dataset.ejey);
    const EJE_X = parseInt(LUGAR_RANDOM.dataset.ejex);
    partida[EJE_Y].splice(EJE_X, 1, ENEMIGO);
    LUGAR_RANDOM.id = "enemigo" + id_enemigo;
    mover_enemigo("enemigo" + id_enemigo);
    id_enemigo++;
    cargar();
}

//Función encargada de ver delante del enemigo

function verdelante_enemigo(ejex, ejey) {
    switch (partida[ejey][ejex]) {
        case ENEMIGO:
            return false;
        case TEXTO:
            sumar_fuego();
            return true;
        case PROTA:
            vida--;
            comprobar_vida();
            return false;
        case BALA:
            return false;
        default:
            return true;
    }
}


//Función encargada de mover al enemigo

function mover_enemigo(id) {
    setTimeout(() => {
        var movimiento_x;
        var movimiento_y;
        var desplazamiento_random;
        const EL_ENEMIGO = document.getElementById(id);
        const JUGADOR = document.getElementById("protagonista");
        if (!EL_ENEMIGO || !JUGADOR) return;
        const EJE_X_ENEMIGO = parseInt(EL_ENEMIGO.dataset.ejex);
        const EJE_Y_ENEMIGO = parseInt(EL_ENEMIGO.dataset.ejey);

        const EJE_X_JUGADOR = parseInt(JUGADOR.dataset.ejex);
        const EJE_Y_JUGADOR = parseInt(JUGADOR.dataset.ejey);

        if (EJE_X_ENEMIGO > EJE_X_JUGADOR) {
            movimiento_x = 'este';
        } else if (EJE_X_ENEMIGO < EJE_X_JUGADOR) {
            movimiento_x = 'oeste';
        }
        if (EJE_Y_ENEMIGO > EJE_Y_JUGADOR) {
            movimiento_y = 'norte';
        } else if (EJE_Y_ENEMIGO < EJE_Y_JUGADOR) {
            movimiento_y = 'sur';
        }

        if (movimiento_x && movimiento_y) {
            desplazamiento_random = Math.floor(Math.random() * 2);
        } else if (movimiento_x) {
            desplazamiento_random = 0;
        } else {
            desplazamiento_random = 1;
        }
        const ELEMENTO = conseguir_elemento(EJE_X_ENEMIGO, EJE_Y_ENEMIGO);
        if (!ELEMENTO) return;
        switch (desplazamiento_random) {
            case 0:
                switch (movimiento_x) {
                    case 'este':
                        const NUEVO_EJE_X_ENEMIGO_E = EJE_X_ENEMIGO - 1;
                        if (!verdelante_enemigo(NUEVO_EJE_X_ENEMIGO_E, EJE_Y_ENEMIGO)) {
                            mover_enemigo(id);
                            return;
                        }
                        ELEMENTO.classList.remove("enemigo");
                        ELEMENTO.removeAttribute("id");
                        ELEMENTO.style.removeProperty("transform");
                        ELEMENTO.dataset.visto = "visto";
                        partida[EJE_Y_ENEMIGO].splice(EJE_X_ENEMIGO, 1, FUEGO);
                        const NUEVO_ELEMENTO_E = conseguir_elemento(NUEVO_EJE_X_ENEMIGO_E, EJE_Y_ENEMIGO);
                        partida[EJE_Y_ENEMIGO].splice(NUEVO_EJE_X_ENEMIGO_E, 1, ENEMIGO);
                        NUEVO_ELEMENTO_E.id = id;
                        NUEVO_ELEMENTO_E.classList.add("enemigo");
                        NUEVO_ELEMENTO_E.style.transform = "rotate(90deg)";
                        cargar();
                        break;
                    case 'oeste':
                        const NUEVO_EJE_X_ENEMIGO_O = EJE_X_ENEMIGO + 1;
                        if (!verdelante_enemigo(NUEVO_EJE_X_ENEMIGO_O, EJE_Y_ENEMIGO)) {
                            mover_enemigo(id);
                            return;
                        }
                        ELEMENTO.classList.remove("enemigo");
                        ELEMENTO.removeAttribute("id");
                        ELEMENTO.style.removeProperty("transform");
                        ELEMENTO.dataset.visto = "visto";
                        partida[EJE_Y_ENEMIGO].splice(EJE_X_ENEMIGO, 1, FUEGO);
                        const NUEVO_ELEMENTO_O = conseguir_elemento(NUEVO_EJE_X_ENEMIGO_O, EJE_Y_ENEMIGO);
                        partida[EJE_Y_ENEMIGO].splice(NUEVO_EJE_X_ENEMIGO_O, 1, ENEMIGO);
                        NUEVO_ELEMENTO_O.id = id;
                        NUEVO_ELEMENTO_O.classList.add("enemigo");
                        NUEVO_ELEMENTO_O.style.transform = "rotate(-90deg)";
                        cargar();
                        break;
                }
                break;
            case 1:
                switch (movimiento_y) {
                    case 'sur':
                        const NUEVO_EJE_Y_ENEMIGO_S = EJE_Y_ENEMIGO + 1;
                        if (!verdelante_enemigo(EJE_X_ENEMIGO, NUEVO_EJE_Y_ENEMIGO_S)) {
                            mover_enemigo(id);
                            return;
                        }
                        ELEMENTO.classList.remove("enemigo");
                        ELEMENTO.removeAttribute("id");
                        ELEMENTO.style.removeProperty("transform");
                        ELEMENTO.dataset.visto = "visto";
                        partida[EJE_Y_ENEMIGO].splice(EJE_X_ENEMIGO, 1, FUEGO);
                        const NUEVO_ELEMENTO_S = conseguir_elemento(EJE_X_ENEMIGO, NUEVO_EJE_Y_ENEMIGO_S);
                        partida[NUEVO_EJE_Y_ENEMIGO_S].splice(EJE_X_ENEMIGO, 1, ENEMIGO);
                        NUEVO_ELEMENTO_S.id = id;
                        NUEVO_ELEMENTO_S.classList.add("enemigo");
                        NUEVO_ELEMENTO_S.style.transform = "rotate(0deg)";
                        cargar();
                        break;

                    case 'norte':
                        const NUEVO_EJE_Y_ENEMIGO_N = EJE_Y_ENEMIGO - 1;
                        if (!verdelante_enemigo(EJE_X_ENEMIGO, NUEVO_EJE_Y_ENEMIGO_N)) {
                            mover_enemigo(id);
                            return;
                        }
                        ELEMENTO.classList.remove("enemigo");
                        ELEMENTO.removeAttribute("id");
                        ELEMENTO.style.removeProperty("transform");
                        ELEMENTO.dataset.visto = "visto";
                        partida[EJE_Y_ENEMIGO].splice(EJE_X_ENEMIGO, 1, FUEGO);
                        const NUEVO_ELEMENTO_N = conseguir_elemento(EJE_X_ENEMIGO, NUEVO_EJE_Y_ENEMIGO_N);
                        partida[NUEVO_EJE_Y_ENEMIGO_N].splice(EJE_X_ENEMIGO, 1, ENEMIGO);
                        NUEVO_ELEMENTO_N.id = id;
                        NUEVO_ELEMENTO_N.classList.add("enemigo");
                        NUEVO_ELEMENTO_N.style.transform = "rotate(180deg)";
                        cargar();
                        break;
                }
                break;
        }
        mover_enemigo(id);
    }, velocidad_enemigo);

}

//Funcion encargada de gestionar los dropeos de los enemigos

function dropear_objeto(ejex, ejey) {
    const NUMERO_RANDOM = Math.floor(Math.random() * 101);

    if (NUMERO_RANDOM <= 10) {

    }
}

//Funciones encargadas de gestionar las cuentas de las casillas quemadas y restantes

function sumar_fuego() {
    casillas_quemadas++;
    casillas_restantes--;
    CASILLAS_QUEMADAS.textContent = casillas_quemadas;
    CASILLAS_RESTANTES.textContent = casillas_restantes;
    derrota();
}

function restar_fuego() {
    casillas_quemadas--;
    casillas_restantes++;
    CASILLAS_QUEMADAS.textContent = casillas_quemadas;
    CASILLAS_RESTANTES.textContent = casillas_restantes;
    victoria();
}

//Funcion que obtiene un elemento del DOM o null si no existe

function conseguir_elemento(ejex, ejey) {
    return document.querySelector(`[data-ejex="${ejex}"][data-ejey="${ejey}"]`);
}