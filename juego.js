
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
    if (LUGARES_DISPONIBLES.length === 0) return;
    const NUM_RANDOM = Math.floor(Math.random() * (LUGARES_DISPONIBLES.length));
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

//Funcion encargada de insertar aleatoriamente fuego en los bordes

function spawnear_fuego() {
    if (casillas_quemadas === 0) return;
    const PARED_RANDOM = Math.floor(Math.random() * 5);
    const POSICION = Math.floor(Math.random() * TAMAÑO);
    var nuevo_array;
    var nueva_posicion;
    switch (PARED_RANDOM) {
        case 1:
            nueva_posicion = 0;
            nuevo_array = POSICION;
            break;
        case 2:
            nueva_posicion = POSICION;
            nuevo_array = 0;
            break;
        case 3:
            nueva_posicion = TAMAÑO - 1;
            nuevo_array = POSICION;
            break;
        case 4:
            nueva_posicion = POSICION;
            nuevo_array = TAMAÑO - 1;
            break;
    }
    const ELEMENTO = conseguir_elemento(nueva_posicion, nuevo_array);
    if (!ELEMENTO) return;
    if (partida[nuevo_array][nueva_posicion] !== TEXTO) return;
    ELEMENTO.classList.add("fuego");
    ELEMENTO.dataset.visto = "visto";
    partida[nuevo_array].splice(nueva_posicion, 1, FUEGO);
    sumar_fuego();
}


//Función que inserta la pistola de agua 

function insertar_pistola() {
    const array_random = Math.floor(Math.random() * (TAMAÑO));
    const posicion_random = Math.floor(Math.random() * (TAMAÑO));
    if (partida[array_random][posicion_random] == TEXTO) {
        partida[array_random][posicion_random] = PISTOLA;
    } else {
        insertar_pistola();
    }
}

//Funcion que mueve la imagen del jugador para que apunte en la direccion del movimiento

function verdireccion() {
    var g;
    protagonista = document.getElementById("protagonista");
    if (!protagonista) return;
    switch (direccion) {
        case 'norte':
            g = grados_rotacion.norte;
            break;
        case 'sur':
            g = grados_rotacion.sur;
            break;
        case 'este':
            g = grados_rotacion.este;
            break;
        case 'oeste':
            g = grados_rotacion.oeste;
            break;
    }
    protagonista.style.transform = `rotate(${g}deg)`;
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
            inventario.push({ "nombre": 'pistola', "ruta": objetos.pistola, "cantidad": 1 });
            cargar_inventario();
            insertar_fuego();
            esparcir_fuego();
            spawnear_enemigo();
            break;
        case PLASM_CANON:
            avanzar = false;
            ELEMENTO.removeAttribute("id");
            ELEMENTO.textContent = TEXTO;
            partida[ejey][ejex] = TEXTO;
            inventario.push({ "nombre": 'plasm_canon', "ruta": objetos.plasm_canon, "cantidad": 1 });
            cargar_inventario();
            break;
        case VENDAS:
            avanzar = false;
            ELEMENTO.removeAttribute("id");
            ELEMENTO.textContent = TEXTO;
            partida[ejey][ejex] = TEXTO;
            const vendas = inventario.find(o => o.nombre === "vendas");
            if (vendas) {
                vendas.cantidad += 1;
            } else {
                inventario.push({ "nombre": 'vendas', "ruta": objetos.vendas, "cantidad": 1 });
            }
            cargar_inventario();
            break;
        case GRANADA:
            avanzar = false;
            ELEMENTO.removeAttribute("id");
            ELEMENTO.textContent = TEXTO;
            partida[ejey][ejex] = TEXTO;
            const granada = inventario.find(o => o.nombre === "granada");
            if (granada) {
                granada.cantidad += 5;
            } else {
                inventario.push({ "nombre": 'granada', "ruta": objetos.granada, "cantidad": 5 });
            }
            cargar_inventario();
            break;
        case BALA:
            avanzar = false;
        case PLASM_BULLET:
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
    if (!protagonista) return;
    protagonista.removeAttribute("id");
    protagonista.style.removeProperty("transform");
    partida[player_array].splice(player_position, 1, texto_pisado);
    var nuevo_array;
    var nueva_posicion;

    switch (direccion) {
        case 'norte':
            nuevo_array = player_array - 1;
            nueva_posicion = player_position;
            break;
        case 'sur':
            nuevo_array = player_array + 1;
            nueva_posicion = player_position;
            break;
        case 'este':
            nuevo_array = player_array;
            nueva_posicion = player_position - 1;
            break;
        case 'oeste':
            nuevo_array = player_array;
            nueva_posicion = player_position + 1;
            break;
    }
    if (nueva_posicion == -1 || nueva_posicion == TAMAÑO ||
        nuevo_array == -1 || nuevo_array == TAMAÑO ||
        !(verdelante(nueva_posicion, nuevo_array))) {
        partida[player_array].splice(player_position, 1, PROTA);
    } else {
        partida[nuevo_array].splice(nueva_posicion, 1, PROTA);
        switch (direccion) {
            case "norte":
                player_array--;
                break;
            case 'sur':
                player_array++;
                break;
            case 'este':
                player_position--;
                break;
            case 'oeste':
                player_position++;
                break;
        }
    }
    cargar();
    verdireccion();
}

//Eventos encargados de disparar al pulsar las flechas

document.addEventListener('keydown', event => {
    const PROTAGONISTA = document.getElementById("protagonista");
    if (!PROTAGONISTA) return;
    if (vida <= 0) return;
    if (equipado == "pistola") {

        switch (event.key) {
            case 'ArrowUp':
                PROTAGONISTA.style.transform = "rotate(180deg)";
                direccion = 'norte';
                crear_bala();
                break;
            case 'ArrowDown':
                PROTAGONISTA.style.transform = "rotate(0deg)";
                direccion = 'sur';
                crear_bala();
                break;
            case 'ArrowLeft':
                PROTAGONISTA.style.transform = "rotate(90deg)";
                direccion = 'este';
                crear_bala();
                break;
            case 'ArrowRight':
                PROTAGONISTA.style.transform = "rotate(-90deg)";
                direccion = 'oeste';
                crear_bala();
                break;
        }
    } else if (equipado == "plasm_canon") {
        switch (event.key) {
            case 'ArrowUp':
                PROTAGONISTA.style.transform = "rotate(180deg)";
                direccion = 'norte';
                crear_plasm_bullet();
                break;
            case 'ArrowDown':
                PROTAGONISTA.style.transform = "rotate(0deg)";
                direccion = 'sur';
                crear_plasm_bullet();
                break;
            case 'ArrowLeft':
                PROTAGONISTA.style.transform = "rotate(90deg)";
                direccion = 'este';
                crear_plasm_bullet();
                break;
            case 'ArrowRight':
                PROTAGONISTA.style.transform = "rotate(-90deg)";
                direccion = 'oeste';
                crear_plasm_bullet();
                break;
        }
    } else if (equipado == "granada") {
        var objeto_granada = inventario.find(o => o.nombre === "granada");
        switch (event.key) {
            case 'ArrowUp':
                PROTAGONISTA.style.transform = "rotate(180deg)";
                direccion = 'norte';
                lanzar_granada();
                objeto_granada.cantidad--;
                cargar_inventario();
                break;
            case 'ArrowDown':
                PROTAGONISTA.style.transform = "rotate(0deg)";
                direccion = 'sur';
                lanzar_granada();
                objeto_granada.cantidad--;
                cargar_inventario();
                break;
            case 'ArrowLeft':
                PROTAGONISTA.style.transform = "rotate(90deg)";
                direccion = 'este';
                lanzar_granada();
                objeto_granada.cantidad--;
                cargar_inventario();
                break;
            case 'ArrowRight':
                PROTAGONISTA.style.transform = "rotate(-90deg)";
                direccion = 'oeste';
                lanzar_granada();
                objeto_granada.cantidad--;
                cargar_inventario();
                break;
        }
    }
});

//Eventos que se encargan de mover al usuario

document.addEventListener('keydown', (event) => {
    const PROTAGONISTA = document.getElementById("protagonista");
    if (!PROTAGONISTA) return;
    if (!(vida > 0)) return;
    switch (event.key) {
        case 'w':
        case 'W':
            direccion = 'norte';
            mover();
            break;
        case 's':
        case 'S':
            direccion = 'sur';
            mover();
            break;
        case 'a':
        case 'A':
            direccion = 'este';
            mover();
            break;
        case 'd':
        case 'D':
            direccion = 'oeste';
            mover();
            break;
    }
});


//Bloque encargado del teclado numerico / inventario del jugador

document.addEventListener('keydown', event => {
    var i;
    protagonista = document.getElementById("protagonista");
    if (!protagonista) return;
    if (vida <= 0) return;
    switch (event.key) {
        case '1':
            if (inventario.length !== 0) {
                i = 0;
            }
            break;

        case '2':
            if (inventario.length > 1) {
                i = 1;
            }
            break;
        case '3':
            if (inventario.length > 2) {
                i = 2;
            }
            break;
        case '4':
            if (inventario.length > 3) {
                i = 3;
            }
            break;
        case '5':
            if (inventario.length > 4) {
                i = 4;
            }
            break;
    }
    if (i === undefined) return;
    if (!equipado) {
        SLOTS_INVENTARIO[i].classList.add("equipado");
        equipado = inventario[i].nombre;
    } else {
        if (SLOTS_INVENTARIO[i].classList.contains("equipado")) {
            SLOTS_INVENTARIO[i].classList.remove("equipado");
            equipado = "";
        } else {
            const SLOT_EQUIPADO = document.querySelector(".equipado")
            SLOT_EQUIPADO.classList.remove("equipado");
            SLOTS_INVENTARIO[i].classList.add("equipado");
            equipado = inventario[i].nombre;
        }
    }

});

//Evento encargado de usar objetos

document.addEventListener('keydown', (event) => {
    if (vida <= 0) return;
    switch (event.key) {
        case 'q':
        case 'Q':
            if (equipado == "vendas") {
                if (vida < 3 && vida > 0) {
                    for (let objeto of inventario) {
                        if (objeto.nombre == "vendas") {
                            objeto_vendas = objeto;
                        }
                    }
                    objeto_vendas.cantidad--;
                    vida++;
                    comprobar_vida();
                    cargar_inventario()
                }
            }
            break;
    }
});

//Funcion que crea la bala

function crear_bala() {
    const PRINCIPAL = document.getElementById("protagonista");
    const ARRAY_ACTUAL = parseInt(PRINCIPAL.dataset.ejey);
    const POSICION_ACTUAL = parseInt(PRINCIPAL.dataset.ejex);
    var nuevo_array;
    var nueva_posicion;
    switch (direccion) {
        case 'norte':
            nuevo_array = ARRAY_ACTUAL - 1;
            nueva_posicion = POSICION_ACTUAL;
            break;
        case 'sur':
            nuevo_array = ARRAY_ACTUAL + 1;
            nueva_posicion = POSICION_ACTUAL;
            break;
        case 'este':
            nueva_posicion = POSICION_ACTUAL - 1;
            nuevo_array = ARRAY_ACTUAL;
            break;
        case 'oeste':
            nueva_posicion = POSICION_ACTUAL + 1;
            nuevo_array = ARRAY_ACTUAL;
            break;
    }

    const ELEMENTO = conseguir_elemento(nueva_posicion, nuevo_array);
    if (!ELEMENTO) return;
    switch (partida[nuevo_array][nueva_posicion]) {
        case FUEGO:
            ELEMENTO.removeAttribute("data-visto");
            ELEMENTO.classList.remove("fuego");
            partida[nuevo_array].splice(nueva_posicion, 1, TEXTO);
            restar_fuego();
            cargar();
            return;
        case ENEMIGO:
            ELEMENTO.removeAttribute("id");
            ELEMENTO.classList.remove("enemigo");
            ELEMENTO.style.removeProperty("transform");
            partida[nuevo_array].splice(nueva_posicion, 1, FUEGO);
            ELEMENTO.classList.add("fuego");
            ELEMENTO.dataset.visto = "visto";
            if (dropear_objeto(nueva_posicion, nuevo_array)) restar_fuego();
            cargar();
            return;
        case VENDAS:
        case PLASM_CANON:
        case GRANADA:
            return;
    }
    partida[nuevo_array][nueva_posicion] = BALA;
    ELEMENTO.id = "bala" + id_bala;
    cargar();
    mover_bala(id_bala, nueva_posicion, nuevo_array);
    id_bala++;

}

//Funcion encargada de mover la bala

function mover_bala(id, ejex, ejey) {
    var clase = 1;
    var movimiento = true;
    partida[ejey].splice(ejex, 1, TEXTO);
    var nueva_posicion;
    var nuevo_array;
    var anterior_posicion;
    var anterior_array;
    const DIR = direccion;

    for (let x = 0; x < TAMAÑO; x++) {
        setTimeout(() => {
            const EL_BALA = document.getElementById("bala" + id);
            if (!movimiento) return;
            if (!EL_BALA) {
                movimiento = false;
                return;
            }
            switch (DIR) {
                case 'norte':
                    nuevo_array = ejey - x;
                    nueva_posicion = ejex;
                    anterior_array = ejey - x + 1;
                    anterior_posicion = ejex;
                    break;
                case 'sur':
                    nuevo_array = ejey + x;
                    nueva_posicion = ejex;
                    anterior_array = ejey + x - 1;
                    anterior_posicion = ejex;
                    break;
                case 'este':
                    nuevo_array = ejey;
                    nueva_posicion = ejex - x;
                    anterior_array = ejey;
                    anterior_posicion = ejex - x + 1;
                    break;
                case 'oeste':
                    nuevo_array = ejey;
                    nueva_posicion = ejex + x;
                    anterior_array = ejey;
                    anterior_posicion = ejex + x - 1;
                    break;
            }
            if (!verdelante_bala(nueva_posicion, nuevo_array, anterior_posicion, anterior_array)) {
                movimiento = false;
                return;
            }
            EL_BALA.classList.remove("bala1", "bala2", "bala3", "bala4");
            EL_BALA.removeAttribute("id");
            const ELEMENTO = conseguir_elemento(nueva_posicion, nuevo_array);
            if (ELEMENTO) {
                ELEMENTO.id = "bala" + id;
                if (clase == 5) {
                    clase = 1;
                }
                ELEMENTO.classList.add("bala" + clase);
                partida[nuevo_array].splice(nueva_posicion, 1, BALA);
                if (!(partida[anterior_array][anterior_posicion] == PROTA)) {
                    partida[anterior_array].splice(anterior_posicion, 1, TEXTO);
                }
                clase++;
                cargar();
            }

        }, VELOCIDAD_BALA * x);
    }
}

//Funcion encargada de ver que hay delante de la bala 

function verdelante_bala(nuevo_ejex, nuevo_ejey, ejex, ejey) {
    if (nuevo_ejex < TAMAÑO && nuevo_ejex >= 0 && nuevo_ejey < TAMAÑO && nuevo_ejey >= 0) {
        const ELEMENTO = conseguir_elemento(ejex, ejey);
        const ELEMENTO_NUEVO = conseguir_elemento(nuevo_ejex, nuevo_ejey);
        ELEMENTO.classList.remove("bala1", "bala2", "bala3", "bala4");
        ELEMENTO.removeAttribute("id");
        switch (partida[nuevo_ejey][nuevo_ejex]) {
            case ENEMIGO:
                ELEMENTO_NUEVO.classList.remove("enemigo");
                ELEMENTO_NUEVO.removeAttribute("id");
                ELEMENTO_NUEVO.style.removeProperty("transform");
                ELEMENTO_NUEVO.dataset.visto = "visto";
                ELEMENTO_NUEVO.classList.add("fuego");
                partida[ejey].splice(ejex, 1, TEXTO);
                partida[nuevo_ejey].splice(nuevo_ejex, 1, FUEGO);
                if (dropear_objeto(nuevo_ejex, nuevo_ejey)) restar_fuego();
                enemigos_derrotados++;
                ENEMIGOS.textContent = enemigos_derrotados;
                cambiar_fondo();
                cargar();
                return false;
            case FUEGO:
                ELEMENTO_NUEVO.classList.remove("fuego");
                ELEMENTO_NUEVO.removeAttribute("data-visto");
                partida[ejey].splice(ejex, 1, TEXTO);
                partida[nuevo_ejey].splice(nuevo_ejex, 1, TEXTO);
                restar_fuego();
                cambiar_fondo();
                cargar();
                return false;
            case VENDAS:
            case PLASM_CANON:
            case GRANADA:
                partida[ejey].splice(ejex, 1, TEXTO);
                cargar();
                return false;
        }
        cargar();
        return true;

    } else {
        (partida[ejey][ejex] == FUEGO) ? partida[ejey].splice(ejex, 1, FUEGO) : partida[ejey].splice(ejex, 1, TEXTO);
        const ULTIMO_ELEMENTO = conseguir_elemento(ejex, ejey);
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
                            switch (partida[ejey + y][ejex + x]) {
                                case PROTA:
                                    partida[ejey + y].splice(ejex + x, 1, FUEGO);
                                    ELEMENTO.removeAttribute("id");
                                    ELEMENTO.style.removeProperty("transform");
                                    ELEMENTO.dataset.visto = "visto";
                                    direccion = 'norte';
                                    daño = true;
                                    sumar_fuego();
                                    spawnear_jugador();
                                    continue;
                                case BALA:
                                    ELEMENTO.textContent = TEXTO;
                                    ELEMENTO.removeAttribute("id");
                                    ELEMENTO.classList.remove("bala1", "bala2", "bala3", "bala4");
                                    break;
                                case ENEMIGO:
                                    continue;
                                case VENDAS:
                                    ELEMENTO.removeAttribute("id");
                                    partida[ejey + y].splice(ejex + x, 1, TEXTO);
                                    break;
                                case PLASM_BULLET:
                                    ELEMENTO.classList.remove("plasm_bullet1", "plasm_bullet2");
                                    partida[ejey + y].splice(ejex + x, 1, TEXTO);
                                    break;
                                case PLASM_CANON:
                                    ELEMENTO.removeAttribute("id");
                                    break;
                                case GRANADA:
                                    ELEMENTO.removeAttribute("id");
                                    ELEMENTO.classList.remove("granada_lanzada1", "granada_lanzada2", "granada_lanzada3", "granada_lanzada4");
                                    break;

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
    var background;
    if (casillas_quemadas > MAYORIA) {
        background = "linear-gradient(rgba(248, 8, 8, 0.81),rgba(255, 123, 0, 0.81),rgba(252, 227, 1, 0.87)) , url(../img/fondowebp.webp)";
    } else if (casillas_quemadas > TRES_CUARTOS) {
        background = "linear-gradient(rgba(214, 26, 26, 0.73),rgba(214, 112, 17, 0.8),rgba(231, 210, 20, 0.74)) , url(../img/fondowebp.webp)";
    } else if (casillas_quemadas > MITAD_TOTAL) {
        background = "linear-gradient(rgba(212, 43, 43, 0.57),rgba(214, 112, 17, 0.62),rgba(231, 210, 20, 0.6)) , url(../img/fondowebp.webp)";
    } else if (casillas_quemadas > UN_CUARTO) {
        background = "linear-gradient(rgba(255, 83, 83, 0.464),rgba(214, 112, 17, 0.46),rgba(231, 210, 20, 0.46)) , url(../img/fondowebp.webp)";
    } else {
        background = "linear-gradient(rgba(255, 255, 255, 0.464), rgba(0, 128, 0, 0.53)), url(../img/fondowebp.webp)";
    }
    FONDO.style.background = background;
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
    const SLOTS = document.getElementsByClassName("slot");
    for (let s of SLOTS) {
        const FOTO = s.querySelector(".foto");
        const CANTIDAD = s.querySelector(".cantidad");
        FOTO.src = "";
        FOTO.classList.remove("foto_objeto");
        CANTIDAD.textContent = "";
    }
    for (let x = 0; x < inventario.length; x++) {
        const OBJETO = inventario[x];
        if (OBJETO.cantidad == 0) {
            const SLOT_EQUIPADO = document.querySelector(".equipado");
            const CANTIDAD = SLOT_EQUIPADO.querySelector(".cantidad");
            CANTIDAD.textContent = "";
            SLOT_EQUIPADO.classList.remove("equipado");
            equipado = "";
            inventario.splice([inventario.indexOf(OBJETO)], 1);
            x--;
            continue;
        }
        const RUTA = OBJETO.ruta;
        const CANTIDAD = SLOTS_INVENTARIO[x].querySelector(".cantidad");
        CANTIDAD.textContent = OBJETO.cantidad;
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
        if (tiempo_de_juego % velocidad_spawn_fuego == 0 && Object.keys(inventario).length !== 0) {
            for (let x = 0; x <= 5; x++)spawnear_fuego();
        }
        if (casillas_quemadas < 300 && !spawnear_enemigos) {
            spawnear_enemigo();
            spawnear_enemigos = true;
        }
        if (casillas_quemadas > 300) {
            velocidad_fuego *= 1.01;
            velocidad_enemigo *= 1.01;
            ratio_spawneo *= 1.01;
        } else {
            velocidad_fuego *= 0.99;
            velocidad_enemigo *= 0.99;
            ratio_spawneo *= 0.99;
        }
        avanzar_tiempo();
    }, 1000);
}

//Funcion que spawnea un enemigo 

function spawnear_enemigo() {
    setTimeout(() => {
        if (casillas_quemadas >= TRES_CUARTOS) {
            spawnear_enemigos = false;
            return;
        }
        if (vida <= 0) return;
        const LUGARES_DISPONIBLES = document.querySelectorAll(".casilla:not(.fuego):not([id]):not(.plasm_bullet):not([class^='granada_lanzada'])");
        if (LUGARES_DISPONIBLES.length === 0) return;
        sumar_fuego();
        const NUM_RANDOM = Math.floor(Math.random() * (LUGARES_DISPONIBLES.length));
        const LUGAR_RANDOM = LUGARES_DISPONIBLES[NUM_RANDOM];
        const EJE_Y = parseInt(LUGAR_RANDOM.dataset.ejey);
        const EJE_X = parseInt(LUGAR_RANDOM.dataset.ejex);
        partida[EJE_Y].splice(EJE_X, 1, ENEMIGO);
        LUGAR_RANDOM.id = "enemigo" + id_enemigo;
        mover_enemigo("enemigo" + id_enemigo);
        id_enemigo++;
        cargar();
        spawnear_enemigo();
    }, ratio_spawneo)
}

//Función encargada de ver delante del enemigo

function verdelante_enemigo(ejex, ejey) {
    switch (partida[ejey][ejex]) {
        case ENEMIGO:
            return false;
        case TEXTO:
            sumar_fuego();
            return true;
        case PLASM_BULLET:
            sumar_fuego();
            return true;
        case PROTA:
            vida--;
            comprobar_vida();
            return false;
        case BALA:
            return false;
        case VENDAS:
        case PLASM_CANON:
        case GRANADA:
        case PISTOLA:
            sumar_fuego();
            return true;
        default:
            return true;
    }
}


//Función encargada de mover al enemigo

function mover_enemigo(id) {
    cambiar_fondo();
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
        var nuevo_eje_x_enemigo;
        var nuevo_eje_y_enemigo;
        var rotacion;
        switch (desplazamiento_random) {
            case 0:
                switch (movimiento_x) {
                    case 'este':
                        nuevo_eje_x_enemigo = EJE_X_ENEMIGO - 1;
                        nuevo_eje_y_enemigo = EJE_Y_ENEMIGO;
                        rotacion = '90deg';
                        break;
                    case 'oeste':
                        nuevo_eje_x_enemigo = EJE_X_ENEMIGO + 1;
                        nuevo_eje_y_enemigo = EJE_Y_ENEMIGO;
                        rotacion = "-90deg";
                        break;
                }
                break;
            case 1:
                switch (movimiento_y) {
                    case 'sur':
                        nuevo_eje_x_enemigo = EJE_X_ENEMIGO;
                        nuevo_eje_y_enemigo = EJE_Y_ENEMIGO + 1;
                        rotacion = '0deg';
                        break;

                    case 'norte':
                        nuevo_eje_x_enemigo = EJE_X_ENEMIGO;
                        nuevo_eje_y_enemigo = EJE_Y_ENEMIGO - 1;
                        rotacion = "180deg";
                        break;
                }
                break;
        }
        if (!verdelante_enemigo(nuevo_eje_x_enemigo, nuevo_eje_y_enemigo)) {
            mover_enemigo(id);
            return;
        }
        ELEMENTO.classList.remove("enemigo");
        ELEMENTO.removeAttribute("id");
        ELEMENTO.style.removeProperty("transform");
        ELEMENTO.dataset.visto = "visto";
        partida[EJE_Y_ENEMIGO].splice(EJE_X_ENEMIGO, 1, FUEGO);
        const NUEVO_ELEMENTO_E = conseguir_elemento(nuevo_eje_x_enemigo, nuevo_eje_y_enemigo);
        partida[nuevo_eje_y_enemigo].splice(nuevo_eje_x_enemigo, 1, ENEMIGO);
        NUEVO_ELEMENTO_E.id = id;
        NUEVO_ELEMENTO_E.classList.add("enemigo");
        NUEVO_ELEMENTO_E.style.transform = `rotate(${rotacion})`;
        cargar();
        mover_enemigo(id);
    }, velocidad_enemigo);

}

//Funcion encargada de gestionar los dropeos de los enemigos

function dropear_objeto(ejex, ejey) {
    const NUMERO_RANDOM = Math.floor(Math.random() * 101);
    var objeto_plasm_canon = inventario.find(o => o.nombre == "plasm_canon");
    var objeto_vendas = inventario.find(o => o.nombre == "vendas");
    var objeto_granada = inventario.find(o => o.nombre == "granada");
    const ELEMENTO = conseguir_elemento(ejex, ejey);
    if (!ELEMENTO) return;

    let nombre;
    let simbolo;

    if (NUMERO_RANDOM < DROP_PLASM_CANON && !objeto_plasm_canon && !document.getElementById("id_plasm_canon")) {
        nombre = "plasm_canon";
        simbolo = PLASM_CANON;
    } else if (NUMERO_RANDOM < DROP_VENDAS) {
        const NUM_VENDAS = document.querySelectorAll("#id_vendas").length;
        const CANTIDAD = objeto_vendas?.cantidad ?? 0;
        if (CANTIDAD + NUM_VENDAS < 10) {
            nombre = "vendas";
            simbolo = VENDAS;
        } else {
            return;
        }
    } else if (NUMERO_RANDOM < DROP_GRANADA) {
        const NUM_GRANADAS = (document.querySelectorAll("#id_granada").length) * 5;
        const CANTIDAD = objeto_granada.cantidad;
        if (CANTIDAD + NUM_GRANADAS < 30) {
            nombre = "granada";
            simbolo = GRANADA;
        } else {
            return;
        }
    }

    if (nombre) {
        partida[ejey][ejex] = simbolo;
        ELEMENTO.id = "id_" + nombre;
        ELEMENTO.classList.remove("fuego");
        ELEMENTO.removeAttribute("data-visto");
        return true;
    }
    return false;

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

//Funcion que crea las balas de plasma que recorren todo en linea recta

function crear_plasm_bullet() {
    const EL_PROTA = document.getElementById("protagonista");
    if (!EL_PROTA) return;
    const EJE_X_PROTA = player_position;
    const EJE_Y_PROTA = player_array;
    var nuevo_array;
    var nueva_posicion;
    var movimiento = true;
    id_plasm_bullet++;
    const ID = id_plasm_bullet;
    for (let x = 1; x < TAMAÑO; x++) {
        switch (direccion) {
            case 'norte':
                nueva_posicion = EJE_X_PROTA;
                nuevo_array = EJE_Y_PROTA - x;
                break;
            case 'sur':
                nueva_posicion = EJE_X_PROTA;
                nuevo_array = EJE_Y_PROTA + x;
                break;
            case 'este':
                nueva_posicion = EJE_X_PROTA - x;
                nuevo_array = EJE_Y_PROTA;
                break;
            case 'oeste':
                nueva_posicion = EJE_X_PROTA + x;
                nuevo_array = EJE_Y_PROTA;
                break;
        }

        const ELEMENTO = conseguir_elemento(nueva_posicion, nuevo_array);
        if (!ELEMENTO) break;
        if (partida[nuevo_array][nueva_posicion] == PROTA) continue;
        if (!movimiento) break;
        if (!verdelante_plasm_bullet(nueva_posicion, nuevo_array)) {
            movimiento = false;
            break;
        }
        if (partida[nuevo_array][nueva_posicion] == TEXTO) {
            partida[nuevo_array][nueva_posicion] = PLASM_BULLET;
            ELEMENTO.id = "plasm_bullet" + ID;
            (nueva_posicion == EJE_X_PROTA) ? ELEMENTO.classList.add("plasm_bullet1") : ELEMENTO.classList.add("plasm_bullet2");
        }
    }
    cargar();
    setTimeout(() => {
        const BALAS = document.querySelectorAll(`[id="${"plasm_bullet" + ID}"]`);
        BALAS.forEach(element => {
            element.classList.remove("plasm_bullet1", "plasm_bullet2");
            element.removeAttribute("id");
            const ejex = parseInt(element.dataset.ejex);
            const ejey = parseInt(element.dataset.ejey);
            if (partida[ejey][ejex] == PLASM_BULLET) partida[ejey][ejex] = TEXTO;
        });
    }, velocidad_plasm_bullet)
}

//Función que mira delante de las plasm_bullet

function verdelante_plasm_bullet(ejex, ejey) {
    const ELEMENTO = conseguir_elemento(ejex, ejey);
    if (!ELEMENTO) return false;
    switch (partida[ejey][ejex]) {
        case FUEGO:
            ELEMENTO.classList.remove("fuego");
            ELEMENTO.removeAttribute("data-visto");
            partida[ejey].splice(ejex, 1, TEXTO);
            restar_fuego();
            cambiar_fondo();
            cargar();
            return true;
        case ENEMIGO:
            ELEMENTO.classList.remove("enemigo", "fuego");
            ELEMENTO.removeAttribute("data-visto");
            ELEMENTO.removeAttribute("id");
            ELEMENTO.style.removeProperty("transform");
            partida[ejey][ejex] = TEXTO;
            restar_fuego();
            enemigos_derrotados++;
            ENEMIGOS.textContent = enemigos_derrotados;
            dropear_objeto(ejex, ejey);
            cambiar_fondo();
            cargar();
            return true;
    }
    return true;
}

//Funcion que lanza la granada

function lanzar_granada() {
    const PROTAGONISTA = document.getElementById("protagonista");
    var movimiento = true;
    let nuevo_array, nueva_posicion, anterior_array, anterior_posicion;
    const DIR = direccion;
    var clase = 0;

    if (!PROTAGONISTA) return;
    const EJEX = parseInt(PROTAGONISTA.dataset.ejex);
    const EJEY = parseInt(PROTAGONISTA.dataset.ejey);
    for (let x = 1; x <= TAMAÑO; x++) {
        setTimeout(() => {
            switch (DIR) {
                case 'norte':
                    nueva_posicion = EJEX;
                    nuevo_array = EJEY - x;
                    anterior_posicion = EJEX;
                    anterior_array = EJEY - x + 1;
                    break;
                case 'sur':
                    nueva_posicion = EJEX;
                    nuevo_array = EJEY + x;
                    anterior_posicion = EJEX;
                    anterior_array = EJEY + x - 1;
                    break;
                case 'este':
                    nueva_posicion = EJEX - x;
                    nuevo_array = EJEY;
                    anterior_posicion = EJEX - x + 1;
                    anterior_array = EJEY;
                    break;
                case 'oeste':
                    nueva_posicion = EJEX + x;
                    nuevo_array = EJEY;
                    anterior_posicion = EJEX + x - 1;
                    anterior_array = EJEY;
                    break;
            }
            const ELEMENTO = conseguir_elemento(anterior_posicion, anterior_array)
            const NUEVO_ELEMENTO = conseguir_elemento(nueva_posicion, nuevo_array);
            if (!ELEMENTO || !movimiento) return;
            if (!NUEVO_ELEMENTO) {
                movimiento = false;
                ELEMENTO.classList.remove("granada_lanzada1", "granada_lanzada2", "granada_lanzada3", "granada_lanzada4");
                partida[anterior_array][anterior_posicion] = TEXTO;
                return;
            }
            if (!verdelante_granada(nueva_posicion, nuevo_array)) {
                ELEMENTO.classList.remove("granada_lanzada1", "granada_lanzada2", "granada_lanzada3", "granada_lanzada4");
                if (partida[anterior_array][anterior_posicion] == GRANADA) {
                    partida[anterior_array][anterior_posicion] = TEXTO;
                }
                movimiento = false;
                cargar();
                return;
            }
            if (partida[anterior_array][anterior_posicion] != PROTA) {
                ELEMENTO.classList.remove("granada_lanzada1", "granada_lanzada2", "granada_lanzada3", "granada_lanzada4");
                partida[anterior_array][anterior_posicion] = TEXTO;
            }
            clase++;
            if (clase > 4) clase = 1;
            NUEVO_ELEMENTO.classList.add("granada_lanzada" + clase);
            partida[nuevo_array][nueva_posicion] = GRANADA;
            cargar();
        }, velocidad_granada * x);
    }

}

//Funcion que ve delante de la granada

function verdelante_granada(ejex, ejey) {
    const ELEMENTO = conseguir_elemento(ejex, ejey);
    if (!ELEMENTO) return;
    switch (partida[ejey][ejex]) {
        case TEXTO:
            return true;
        case FUEGO:
        case ENEMIGO:
            activar_granada(ejex, ejey);
            return false;
        case PROTA:
            return false;
        default:
            return false;
    }
}

//Funcion que activa la granada

function activar_granada(ejex, ejey) {
    const RADIO = 2;
    const NUMERO = numero_granada;
    numero_granada++;
    for (let x = -RADIO; x <= RADIO; x++) {
        for (let y = -RADIO; y <= RADIO; y++) {
            const nx = ejex + x;
            const ny = ejey + y;
            const ELEMENTO = conseguir_elemento(nx, ny);
            if (!ELEMENTO) continue;
            switch (partida[ny][nx]) {
                case ENEMIGO:
                    ELEMENTO.removeAttribute("data-visto");
                    ELEMENTO.classList.remove("fuego", "enemigo");
                    ELEMENTO.style.removeProperty("transform");
                    ELEMENTO.removeAttribute("id");
                    partida[ny][nx] = TEXTO;
                    restar_fuego();
                    enemigos_derrotados++;
                    ENEMIGOS.textContent = enemigos_derrotados;
                    dropear_objeto(nx, ny);
                    break;
                case FUEGO:
                    ELEMENTO.removeAttribute("data-visto");
                    ELEMENTO.classList.remove("fuego");
                    partida[ny][nx] = TEXTO;
                    restar_fuego();
                    break;
            }
            ELEMENTO.classList.add("numero_granada" + NUMERO);
            if ((x) == 0 && (y) == 0) {
                ELEMENTO.classList.add("impacto");
            } else if ((x == 1 || x == 0 || x == -1) && (y == -1 || y == 1 || y == 0)) {
                ELEMENTO.classList.add("radio1");
            } else {
                ELEMENTO.classList.add("radio2");
            }

        }
        cargar();
        cambiar_fondo();
    }
    setTimeout(() => {
        const ELEMENTOS = document.querySelectorAll(".numero_granada" + NUMERO);
        for (let element of ELEMENTOS) {
            element.classList.remove("impacto", "radio1", "radio2", "numero_granada" + NUMERO);
        }
    }, 300);
}