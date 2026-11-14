
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
                casilla.classList.remove("bala1");
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
    return MITAD;
}

//Funcion encargada de spawnear al jugador tras morir

function spawnear_jugador() {
    const EJE_X_RANDOM = Math.round(Math.random() * (TAMAÑO - 1));
    const EJE_Y_RANDOM = Math.round(Math.random() * (TAMAÑO - 1));
    switch (partida[EJE_Y_RANDOM][EJE_X_RANDOM]) {
        case FUEGO:
        case PISTOLA:
        case ENEMIGO:
        case BALA:
            spawnear_jugador();
            break;
        default:
            partida[EJE_Y_RANDOM].splice(EJE_X_RANDOM, 1, PROTA);
            player_array = EJE_Y_RANDOM;
            player_position = EJE_X_RANDOM;
    }
}

//Función que inserta el primer incendio en el juego

function insertar_fuego() {
    const EJE_X = TAMAÑO - 1;
    const EJE_Y = 0;
    partida[EJE_Y].splice(EJE_X, 1, FUEGO);
    pos_fuego_inicio = [EJE_X, EJE_Y];
    const ELEMENTO = document.querySelector(`[data-ejex="${EJE_X}"][data-ejey="${EJE_Y}"]`);
    ELEMENTO.dataset.visto = "visto";
    sumar_fuego();
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
    const ELEMENTO = document.querySelector(`[data-ejex="${ejex}"][data-ejey="${ejey}"]`)
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
            esparcir_fuego(pos_fuego_inicio[0], pos_fuego_inicio[1]);
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
    if (ahora - ultimo_click < COOLDOWN_CLICK) return;
    ultimo_click = ahora;

    if (equipado == "pistola") {
        crear_bala();
    }
});

document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'q':
        case 'Q':
            if (equipado == "pistola") {
                crear_bala();
            }

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
    ) { console.log("bloqueo"); return; }
    switch (direccion) {
        case 'norte':
            const NUEVO_ARRAY_N = ARRAY_ACTUAL - 1;
            const ELEMENTO_N = document.querySelector(`[data-ejex="${POSICION_ACTUAL}"][data-ejey="${NUEVO_ARRAY_N}"]`);
            if (ELEMENTO_N) {
                if (partida[NUEVO_ARRAY_N][POSICION_ACTUAL] == FUEGO) {
                    ELEMENTO_N.removeAttribute("data-visto");
                    ELEMENTO_N.classList.remove("fuego");
                    restar_fuego();
                    victoria();
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
            const ELEMENTO_S = document.querySelector(`[data-ejex="${POSICION_ACTUAL}"][data-ejey="${NUEVO_ARRAY_S}"]`);
            if (ELEMENTO_S) {
                if (partida[NUEVO_ARRAY_S][POSICION_ACTUAL] == FUEGO) {
                    ELEMENTO_S.removeAttribute("data-visto");
                    ELEMENTO_S.classList.remove("fuego");
                    restar_fuego();
                    victoria();
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
            const ELEMENTO_E = document.querySelector(`[data-ejex="${NUEVO_ANCHO_E}"][data-ejey="${ARRAY_ACTUAL}"]`);
            if (ELEMENTO_E) {
                if (partida[ARRAY_ACTUAL][NUEVO_ANCHO_E] == FUEGO) {
                    ELEMENTO_E.removeAttribute("data-visto");
                    ELEMENTO_E.classList.remove("fuego");
                    restar_fuego();
                    victoria();
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
            const ELEMENTO_O = document.querySelector(`[data-ejex="${NUEVO_ANCHO_O}"][data-ejey="${ARRAY_ACTUAL}"]`);
            if (ELEMENTO_O) {
                if (partida[ARRAY_ACTUAL][NUEVO_ANCHO_O] == FUEGO) {
                    ELEMENTO_O.removeAttribute("data-visto");
                    ELEMENTO_O.classList.remove("fuego");
                    restar_fuego();
                    victoria();
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
                    if (!movimiento) {
                        return;
                    }
                    if (!verdelante_bala(ejex, ejey - x, ejex, ejey - x + 1)) {
                        movimiento = false;
                        return;
                    }
                    if (EL_BALA) {
                        EL_BALA.classList.remove("bala1", "bala2", "bala3", "bala4");
                        EL_BALA.removeAttribute("id");
                        const ELEMENTO = document.querySelector(`[data-ejex="${ejex}"][data-ejey="${ejey - x}"]`);
                        if (ELEMENTO) {
                            ELEMENTO.id = "bala" + id;
                            if (clase == 5) {
                                clase = 1;
                            }
                            ELEMENTO.classList.add("bala" + clase);
                            partida[ejey - x].splice(ejex, 1, BALA);
                            partida[ejey - x + 1].splice(ejex, 1, TEXTO);
                            clase++;
                            cargar();
                        }
                    }
                }, VELOCIDAD_BALA * x);
            }
            break;


        case 'sur':
            for (let x = 0; x < TAMAÑO; x++) {
                setTimeout(() => {
                    const EL_BALA = document.getElementById("bala" + id);
                    if (!movimiento) {
                        return;
                    }
                    if (!verdelante_bala(ejex, ejey + x, ejex, ejey + x - 1)) {
                        movimiento = false;
                        return;
                    }
                    if (EL_BALA) {
                        EL_BALA.classList.remove("bala1", "bala2", "bala3", "bala4");
                        EL_BALA.removeAttribute("id");
                        const ELEMENTO = document.querySelector(`[data-ejex="${ejex}"][data-ejey="${ejey + x}"]`);
                        if (ELEMENTO) {
                            ELEMENTO.id = "bala" + id;
                            if (clase == 5) {
                                clase = 1;
                            }
                            ELEMENTO.classList.add("bala" + clase);
                            partida[ejey + x].splice(ejex, 1, BALA);
                            partida[ejey + x - 1].splice(ejex, 1, TEXTO);
                            clase++;
                            cargar();
                        }
                    }
                }, VELOCIDAD_BALA * x);
            }
            break;


        case 'este':
            for (let x = 0; x < TAMAÑO; x++) {
                setTimeout(() => {
                    const EL_BALA = document.getElementById("bala" + id);
                    if (!movimiento) {
                        return;
                    }
                    if (!verdelante_bala(ejex - x, ejey, ejex - x + 1, ejey)) {
                        movimiento = false;
                        return;
                    }
                    if (EL_BALA) {
                        EL_BALA.classList.remove("bala1", "bala2", "bala3", "bala4");
                        EL_BALA.removeAttribute("id");
                        const ELEMENTO = document.querySelector(`[data-ejex="${ejex - x}"][data-ejey="${ejey}"]`);
                        if (ELEMENTO) {
                            ELEMENTO.id = "bala" + id;
                            if (clase == 5) {
                                clase = 1;
                            }
                            ELEMENTO.classList.add("bala" + clase);
                            partida[ejey].splice(ejex - x, 1, BALA);
                            partida[ejey].splice(ejex - x + 1, 1, TEXTO);
                            clase++;
                            cargar();
                        }
                    }
                }, VELOCIDAD_BALA * x);
            }
            break;


        case 'oeste':
            for (let x = 0; x < TAMAÑO; x++) {
                setTimeout(() => {
                    const EL_BALA = document.getElementById("bala" + id);
                    if (!movimiento) {
                        return;
                    }
                    if (!verdelante_bala(ejex + x, ejey, ejex + x - 1, ejey)) {
                        movimiento = false;
                        return;
                    }
                    if (EL_BALA) {
                        EL_BALA.classList.remove("bala1", "bala2", "bala3", "bala4");
                        EL_BALA.removeAttribute("id");
                        const ELEMENTO = document.querySelector(`[data-ejex="${ejex + x}"][data-ejey="${ejey}"]`);
                        if (ELEMENTO) {
                            ELEMENTO.id = "bala" + id;
                            if (clase == 5) {
                                clase = 1;
                            }
                            ELEMENTO.classList.add("bala" + clase);
                            partida[ejey].splice(ejex + x, 1, BALA);
                            partida[ejey].splice(ejex + x - 1, 1, TEXTO);
                            clase++;
                            cargar();
                        }
                    }
                }, VELOCIDAD_BALA * x);
            }
            break;
    }
}

//Funcion encargada de ver que hay delante de la bala 

function verdelante_bala(nuevo_ejex, nuevo_ejey, ejex, ejey) {
    if (nuevo_ejex < TAMAÑO && nuevo_ejex >= 0 && nuevo_ejey < TAMAÑO && nuevo_ejey >= 0) {
        const ELEMENTO = document.querySelector(`[data-ejex="${ejex}"][data-ejey="${ejey}"]`);
        const ELEMENTO_NUEVO = document.querySelector(`[data-ejex="${nuevo_ejex}"][data-ejey="${nuevo_ejey}"]`);
        if (partida[nuevo_ejey][nuevo_ejex] == FUEGO) {
            ELEMENTO.classList.remove("bala1", "bala2", "bala3", "bala4");
            ELEMENTO.removeAttribute("id");
            ELEMENTO_NUEVO.classList.remove("fuego");
            ELEMENTO_NUEVO.removeAttribute("data-visto");
            partida[nuevo_ejey].splice(nuevo_ejex, 1, TEXTO);
            restar_fuego();
            cambiar_fondo();
            victoria();
            return false;
        } else if (partida[nuevo_ejey][nuevo_ejex] == ENEMIGO) {
            ELEMENTO.classList.remove("bala1", "bala2", "bala3", "bala4");
            ELEMENTO.removeAttribute("id");
            ELEMENTO_NUEVO.classList.remove("enemigo");
            partida[nuevo_ejey].splice(nuevo_ejex, 1, FUEGO);
            partida[ejey].splice(ejex, 1, TEXTO);
            enemigos_derrotados++;
            ENEMIGOS.textContent = enemigos_derrotados;
            sumar_fuego();
            cambiar_fondo();
            generar_fuego_de_enemigo(nuevo_ejey, nuevo_ejex);
            return false;
        }
        cargar();
        return true;

    } else {
        partida[ejey].splice(ejex, 1, TEXTO);
        const ULTIMO_ELEMENTO = document.querySelector(`[data-ejex="${ejex}"][data-ejey="${ejey}"]`);
        ULTIMO_ELEMENTO.removeAttribute("id");
        ULTIMO_ELEMENTO.classList.remove("bala1", "bala2", "bala3", "bala4");
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
                    const ELEMENTO = document.querySelector(`[data-ejex="${ejex + x}"][data-ejey="${ejey + y}"]`);
                    if (ELEMENTO) {
                        if (!ELEMENTO.dataset.visto) {
                            if (ELEMENTO.textContent == PROTA) {
                                partida[ejey + y].splice(ejex + x, 1, FUEGO);
                                ELEMENTO.removeAttribute("id");
                                ELEMENTO.style.removeProperty("transform");
                                ELEMENTO.dataset.visto = "visto";
                                direccion = 'norte';
                                daño = true;
                                spawnear_jugador();

                                continue;
                            }
                            else if (ELEMENTO.textContent == PISTOLA) {
                                ELEMENTO.textContent = TEXTO;
                                ELEMENTO.removeAttribute("id");
                                insertar_pistola();
                            } 
                            else if (ELEMENTO.textContent == BALA) {
                                ELEMENTO.textContent = TEXTO;
                                ELEMENTO.removeAttribute("id");
                                ELEMENTO.classList.remove("bala1", "bala2", "bala3", "bala4");
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
    }, VELOCIDAD_FUEGO);
}


//Funcion encargada de cambiar el fondo segun el estado de las casillas

function cambiar_fondo() {
    const FONDO = document.getElementById("body");
    if (casillas_quemadas > 100) {
        FONDO.style.background = "linear-gradient(rgba(255, 83, 83, 0.464),rgba(214, 112, 17, 0.46),rgba(231, 210, 20, 0.46)) , url(../img/fondowebp.webp)";
        FONDO.style.backgroundPosition = "center";
        FONDO.style.backgroundSize = "cover";
    }
    else if (casillas_quemadas > 200) {
        FONDO.style.background = "linear-gradient(rgba(212, 43, 43, 0.57),rgba(214, 112, 17, 0.62),rgba(231, 210, 20, 0.6)) , url(../img/fondowebp.webp)";
        FONDO.style.backgroundPosition = "center";
        FONDO.style.backgroundSize = "cover";
    }
    else if (casillas_quemadas > 300) {
        FONDO.style.background = "linear-gradient(rgba(214, 26, 26, 0.73),rgba(214, 112, 17, 0.8),rgba(231, 210, 20, 0.74)) , url(../img/fondowebp.webp)";
        FONDO.style.backgroundPosition = "center";
        FONDO.style.backgroundSize = "cover";
    }
    else if (casillas_quemadas > 350) {
        FONDO.style.background = "linear-gradient(rgba(248, 8, 8, 0.81),rgba(255, 123, 0, 0.81),rgba(252, 227, 1, 0.87)) , url(../img/fondowebp.webp)";
        FONDO.style.backgroundPosition = "center";
        FONDO.style.backgroundSize = "cover";
    } else {
        FONDO.style.background = "linear-gradient(rgba(255, 255, 255, 0.464), rgba(0, 128, 0, 0.53)), url(../img/fondowebp.webp)";
        FONDO.style.backgroundPosition = "center";
        FONDO.style.backgroundSize = "cover";
    }
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
    if (casillas_quemadas == 0 && casillas_restantes == (TAMAÑO * TAMAÑO)) {
        setTimeout(() => {
            alert("Felicidades conseguiste apagar el incendio");
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
        avanzar_tiempo();
        TIEMPO.textContent = tiempo_de_juego;
        if (tiempo_de_juego % RATIO_SPAWNEO == 0 && Object.keys(inventario).length !== 0) {
            console.log("Spawneando enemigo");
            spawnear_enemigo();
        }
    }, 1000);
}

//Funcion que spawnea un enemigo 

function spawnear_enemigo() {
    const EJE_X_RANDOM = Math.round(Math.random() * (TAMAÑO - 1));
    const EJE_Y_RANDOM = Math.round(Math.random() * (TAMAÑO - 1));
    console.log(partida[EJE_Y_RANDOM][EJE_X_RANDOM])
    switch (partida[EJE_Y_RANDOM][EJE_X_RANDOM]) {
        case PROTA:
        case FUEGO:
        case PISTOLA:
        case ENEMIGO:
            spawnear_enemigo();
            break;
        default:
            partida[EJE_Y_RANDOM].splice(EJE_X_RANDOM, 1, ENEMIGO);
            cargar();
            break;

    }
}

//Genera el fuego que produce un enemigo al morir

function generar_fuego_de_enemigo(ejey, ejex) {
    const ELEMENTO = document.querySelector(`[data-ejex="${ejex}"][data-ejey="${ejey}"]`);
    ELEMENTO.classList.add("fuego");
    ELEMENTO.dataset.visto = "visto";
}


//Funciones encargadas de gestionar las cuentas de las casillas quemadas y restantes

function sumar_fuego() {
    casillas_quemadas++;
    casillas_restantes--;
    CASILLAS_QUEMADAS.textContent = casillas_quemadas;
    CASILLAS_RESTANTES.textContent = casillas_restantes;
}

function restar_fuego() {
    casillas_quemadas--;
    casillas_restantes++;
    CASILLAS_QUEMADAS.textContent = casillas_quemadas;
    CASILLAS_RESTANTES.textContent = casillas_restantes;
}