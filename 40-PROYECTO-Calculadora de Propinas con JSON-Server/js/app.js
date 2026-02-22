let cliente = {
    mesa: '',
    hora: '',
    pedido: []
}
const categorias = {
    1: 'Comida',
    2: 'Bebidas',
    3: 'Postres'
}

const btnGuardarCliente = document.querySelector('#guardar-cliente');
btnGuardarCliente.addEventListener('click', guardarCliente);

function guardarCliente() {
    const mesa = document.querySelector('#mesa').value;
    const hora = document.querySelector('#hora').value;

    // Revisar si hay campos vacíos
    const camposVacios = [mesa, hora].some(campo => campo === ''); // al ser un array tengo acceso al array method de some

    // const yaExiste;
    //     if (!yaExiste === 'd-block'){

    if (camposVacios) {
        // Cómo verificar si ya hay una alerta en javascript para que no se repita el mensaje
        const yaExiste = document.querySelector('.invalid-feedback');

        if (!yaExiste) {
            const alerta = document.createElement('DIV');
            alerta.classList.add('invalid-feedback', 'd-block', 'text-center');
            alerta.textContent = 'Todos los campos son obligatorios'
            document.querySelector('.modal-body form').appendChild(alerta)
            setTimeout(() => {
                alerta.remove();
            }, 3000)
        }
        return;
    }
    // console.log('Todos los campos estan llenos')

    cliente = {
        ...cliente,
        mesa,
        hora
    }; // ...cliente pones el spread operator primero porque sino pega un array vacio encima de nuestro objeto
    //console.log(cliente);

    // OCULTAR MODAL
    const modalFormulario = document.querySelector('#formulario');
    const modalBootsrap = bootstrap.Modal.getInstance(modalFormulario);
    // bootstrap Objeto global que crea Bootstrap JS cuando cargas bootstrap.bundle.min.js.
    // .Modal es la clase de JavaScript que Bootstrap trae para controlar ventanas modales desde código. bootstrap = librería
    // Modal = “módulo/clase” dentro de esa librería para modales
    // con esa clase puedes usar métodos como show(), hide(), toggle(), getInstance()obtiene la instancia de eso que pusiste dentro
    modalBootsrap.hide();

    // Mostrar secciones
    mostrarSecciones();

    //obtener platillos de la API de JSON-Server
    obtenerPlatillos();
}

// porque  function mostrarSecciones()  va fuera de function guardarCliente()? Si una función puede usarse en más de un sitio o representa una tarea separada, déjala fuera.
// Mosotrar secciones ,voy a seleccionar las que tengan d-none , display none
function mostrarSecciones() {
    const seccionesOcultas = document.querySelectorAll('.d-none'); // seleccionas mas de una? querySelectorAll // seccion..ir accediendo a cada seccion..
    seccionesOcultas.forEach(juanita => juanita.classList.remove('d-none')); // va seleccionando cada d-none en cada uno de las secciones que este
}

// GET /platillos (REST)
function obtenerPlatillos() {
    const url = 'http://localhost:3000/platillos';
    fetch(url)
        .then(respuesta => respuesta.json())
        .then(resultado => mostrarPlatillos(resultado)) // una vez que la respuesta es correcta le esta llamando a esa funcion y pasandole los datos
        .catch(error => console.error('Error al obtener platillos:', error))
}



function mostrarPlatillos(platillos) {
    const contenido = document.querySelector('#platillos .contenido'); // selecciona solo a los hijos de id=platillos, esto se hace para que no agarre otros class contenido que haya fuera, asi te aseguras de agarrar el contenedor correcto
    // #platillos sólo lo uso aquí para encontrar exactamente el contenedor donde se van a agregar las filas de platillos.
    // contenido → es el contenedor dentro de #platillos


    platillos.forEach(platillo => {
        const row = document.createElement('DIV');
        row.classList.add('row', 'border-top', 'py-3');

        const nombre = document.createElement('DIV');
        nombre.classList.add('col-md-4');
        nombre.textContent = platillo.nombre; // al lado de platillo los elementos que tiene el json

        const nombre2 = document.createElement('DIV');
        nombre2.classList.add('col-md-3', 'fw-bold');
        nombre2.textContent = `${platillo.precio} €`;

        const categoria = document.createElement('DIV');
        categoria.classList.add('col-md-3');
        categoria.textContent = categorias[platillo.categoria]; // si la categoria es 2 va a filtrar de categorias el numero 2 y va a leer ese label


        const inputCantidad = document.createElement('INPUT');
        inputCantidad.type = 'number';
        inputCantidad.min = 0;
        inputCantidad.value = 0;
        inputCantidad.id = `producto-${platillo.id}`; // estamos iterando sobre el objeto de platillo ,Si platillo.id es 7, entonces queda inputCantidad.id = "producto-7"
        inputCantidad.classList.add('form-control'); // bootstrap clase input

        // AQUÍ relleno el cliente para que empiece a ser algo el pedido que estoy creando

        inputCantidad.oninput = function () { // inputCantidad lo cree arriba y abajo lo pego en el div general que creé const agregar = document.createElement('DIV');
            const cantidad = parseInt(inputCantidad.value); // parseInt para que sean numero
            // console.log(cantidad);
            agregarPlatillo({
                ...platillo,
                cantidad
            }); // Llamas agregarPlatillo(...) para actualizar el pedido.
            // si esperas varios ya no necesitas solo agregarPlatillo(platillo.nombre);
        }



        const agregar = document.createElement('DIV');
        agregar.classList.add('col-md-2');
        agregar.appendChild(inputCantidad); //  esto es como decir que tenemos el div y lo pegamos debajo el div con los nombres del input

        row.appendChild(nombre); // rowo es la clase de bootstrap la que tiene grid
        row.appendChild(nombre2);
        row.appendChild(categoria);
        row.appendChild(agregar);

        contenido.appendChild(row); // contenido → es el contenedor dentro de #platillos dentro del main id platillos hay un h2 y el div vacio donde coloco todo

    })
}
// cliente es:

// cliente = {
//   mesa: 5,
//   hora: "20:30",
//   pedido: [ {...}, {...} ]
// }
function agregarPlatillo(producto) { // producto es un objeto que representa un platillo
    // Extraer el pedido actual
    let {
        pedido
    } = cliente; //  → extraer pedido del cliente 

    // ¿cantidad > 0?
    if (producto.cantidad > 0) {

        // plato representa un plato que ya está en la comanda del cliente.
        // Sí 
        if (pedido.some(plato => plato.id === producto.id)) {


            // Si este artículo que estoy viendo en el pedido tiene el mismo id que el producto que cambió su cantidad, actualiza su cantidad
            const pedidoActualizado = pedido.map(plato => {
                if (plato.id === producto.id) {
                    plato.cantidad = producto.cantidad;
                }

                // para que lo vaya asignando a este arreglo nuevo (pedidoActualizado)
                return plato;
            });

            // Reemplaza completamente el pedido del cliente con este array nuevo que tiene la cantidad actualizada
            cliente.pedido = [...pedidoActualizado];

        } else { // No
            // El plato no existe, lo agregamos al array de pedido
            cliente.pedido = [...pedido, producto] // agrego una copia de lo que ya habia en ese array y el nuevo producto ,> pedido Sale de cliente.pedido por destructuring
            // cliente.pedido nace como array en la linea 4
        }
    } else {
        // Eliminar un elemento del pedido
        const resultado = pedido.filter(plato => plato.id !== producto.id)
        cliente.pedido = [...resultado];
    }
    // Limpiar el codigo HTML previo
    limpiarHTML();

    if (cliente.pedido.length) { // "si hay algo en el arreglo".. si hay articulos en el pedido
        // Mostrar el Resumen
        actualizarResumen();
    } else {
        mensajePedidoVacio();
    }

}

function actualizarResumen() {
    const contenido = document.querySelector('#resumen .contenido');

    const resumen = document.createElement('DIV');
    resumen.classList.add('col-md-6', 'card', 'py-2', 'px-3', 'shadow');

    // Información de la mesa
    const mesa = document.createElement('P');
    mesa.classList.add('fw-bold');
    mesa.textContent = 'Mesa: ';

    const mesaSpan = document.createElement('SPAN');
    mesaSpan.classList.add('fw-normal');
    mesaSpan.textContent = cliente.mesa; // let cliente = { mesa: ''}

    // Información de la hora
    const hora = document.createElement('P');
    hora.classList.add('fw-bold');
    hora.textContent = 'Hora: ';

    const horaSpan = document.createElement('SPAN');
    horaSpan.classList.add('fw-normal');
    horaSpan.textContent = cliente.hora;

    // Agregar a los elementos padre
    mesa.appendChild(mesaSpan);
    hora.appendChild(horaSpan);

    // Título de la sección
    const heading = document.createElement('H3');
    heading.textContent = 'Platillos Consumidos';
    heading.classList.add('my-4', 'text-center');

    // Iterar sobre el array de pedidos
    const grupo = document.createElement('UL');
    grupo.classList.add('list-group');

    // 💡 Ademas no hice esto mas arriba? (line 145)
    // 📍 Sí, puedes tener otra vez const { pedido } = cliente; en otra función.
    // 📍 No es la misma variable: cada función tiene su propio alcance (scope).
    // 📍 Se repite porque en esta función también necesito leer cliente.pedido

    const {
        pedido
    } = cliente; // para poder iterar sobre el aqui abajo
    pedido.forEach(cadaElementoDelArray => { // articulos son los elemenetos que estan en el arreglo de cliente 
        const {
            nombre,
            cantidad,
            precio,
            id
        } = cadaElementoDelArray;

        const lista = document.createElement('LI');
        lista.classList.add('list-group-item');

        const nombreElemento = document.createElement('H4');
        nombreElemento.classList.add('my-4');
        nombreElemento.textContent = nombre;

        // Cantidad del articulo
        const cantidadElemento = document.createElement('P');
        cantidadElemento.classList.add('fw-bold');
        cantidadElemento.textContent = 'Cantidad: ';

        const cantidadValor = document.createElement('SPAN'); // este span se cuelga al P
        cantidadValor.classList.add('fw-normal');
        cantidadValor.textContent = cantidad;

        // Precio del articulo
        const precioEl = document.createElement('P');
        precioEl.classList.add('fw-bold');
        precioEl.textContent = 'Precio: ';

        const precioValor = document.createElement('SPAN'); // este span se cuelga al P
        precioValor.classList.add('fw-normal');
        precioValor.textContent = `${precio} €`;

        // Subtotal del articulo
        const subtotalEl = document.createElement('P');
        subtotalEl.classList.add('fw-bold');
        subtotalEl.textContent = 'Subtotal: ';

        const subtotalValor = document.createElement('SPAN'); // este span se cuelga al P
        subtotalValor.classList.add('fw-normal');
        subtotalValor.textContent = calcularSubtotal(precio, cantidad);

        // Botón para eliminar
        const btnEliminar = document.createElement('BUTTON');
        btnEliminar.classList.add('btn', 'btn-danger');
        btnEliminar.textContent = 'Eliminar del carrito';

        // Función del botón para eliminar
        btnEliminar.onclick = function () {
            eliminarProducto(id)
        }

        // Agregar Valores a sus contenedores
        cantidadElemento.appendChild(cantidadValor);
        precioEl.appendChild(precioValor); // párrafo se lo colgamos al span
        subtotalEl.appendChild(subtotalValor);

        // Agregar Elementos al LI
        lista.appendChild(nombreElemento);
        lista.appendChild(cantidadElemento);
        lista.appendChild(precioEl);
        lista.appendChild(subtotalEl);
        lista.appendChild(btnEliminar);

        // Agregar lista al grupo principal
        grupo.appendChild(lista);
    })

    // Agregar al contenido
    resumen.appendChild(mesa);
    resumen.appendChild(hora);
    resumen.appendChild(heading);
    resumen.appendChild(grupo);

    contenido.appendChild(resumen);

    // Mostrar Formulario de Propinas
    formularioPropinas();
}

function limpiarHTML() {
    const contenidoQueQuitar = document.querySelector('#resumen .contenido');
    while (contenidoQueQuitar.firstChild) {
        contenidoQueQuitar.removeChild(contenidoQueQuitar.firstChild);
    }
}

function calcularSubtotal(precio, cantidad) {
    return `${precio*cantidad} €`
}

function eliminarProducto(id) {
    const {
        pedido
    } = cliente; // EXTRAEMOS EL PEDIDO DEL CLIENTE. const pedido = cliente.pedido; es un “atajo” para acceder al objeto cliente.pedido que guarda el arreglo de platillos que vas agregando.
    const resultado = pedido.filter(plato => plato.id !== id) // LO FILTRAMOS y lo comparamos con  lo comparamos con el id que queremos eliminar; solo se quedan los que tienen id distinto
    cliente.pedido = [...resultado]; // se lo asignamos a pedido

    limpiarHTML();

    if (cliente.pedido.length) {
        actualizarResumen();
    } else {
        mensajePedidoVacio();
    }

    // Ponemos a 0 la cantidad al eliminar el producto
    const productoEliminado = `#producto-${id}`;
    const inputEliminado = document.querySelector(productoEliminado);
    inputEliminado.value = 0;
}

function mensajePedidoVacio() {
    const contenido = document.querySelector('#resumen .contenido');

    const texto = document.createElement('P');
    texto.classList.add('text-center');
    texto.textContent = 'Añade los elementos del pedido';

    contenido.appendChild(texto); // texto es el hijo que quieres meter dentro.
}

function formularioPropinas() { // line 315
    const contenido = document.querySelector('#resumen .contenido');
    const formulario = document.createElement('DIV');
    formulario.classList.add('col-md-6', 'formulario');

    const divFormulario = document.createElement('DIV')
    divFormulario.classList.add('card', 'py-2', 'px-3', 'shadow');

    const heading = document.createElement('H3');
    heading.classList.add('my-4', 'text-center');
    heading.textContent = 'Propina';

    // Radio Button 10% tiene que ser radio button porque solo te deja elegir 1 entre varios
    const radio10 = document.createElement('INPUT') // radio type input
    radio10.type = 'radio';
    radio10.name = 'propina';
    radio10.value = "10";
    radio10.classList.add('form-check-input');
    radio10.onclick = calcularPropina;

    const radio10Label = document.createElement('LABEL');
    radio10Label.textContent = '10%';
    radio10Label.classList.add('form-check-label');

    const radio10Div = document.createElement('DIV'); // este div va a contener tanto el input como el label
    radio10Div.classList.add('form-check'); 

    radio10Div.appendChild(radio10); // div (radio10Div) → ahora radio10 (input type=radio) cuelga dentro de radio10Div
    radio10Div.appendChild(radio10Label); // div (radio10Div) → ahora radio10Label (label) cuelga dentro de radio10Div

        // Radio Button 25%  
    const radio25 = document.createElement('INPUT');
    radio25.type = 'radio';
    radio25.name = 'propina';
    radio25.value = "25";
    radio25.classList.add('form-check-input');
    radio25.onclick = calcularPropina;

    const radio25Label = document.createElement('LABEL');
    radio25Label.textContent = '25%';
    radio25Label.classList.add('form-check-label');

    const radio25Div = document.createElement('DIV'); 
    radio25Div.classList.add('form-check'); 

    radio25Div.appendChild(radio25);  
    radio25Div.appendChild(radio25Label);

            // Radio Button 50%  
    const radio50 = document.createElement('INPUT');
    radio50.type = 'radio';
    radio50.name = 'propina';
    radio50.value = "50";
    radio50.classList.add('form-check-input');
    radio50.onclick = calcularPropina;

    const radio50Label = document.createElement('LABEL');
    radio50Label.textContent = '50%';
    radio50Label.classList.add('form-check-label');

    const radio50Div = document.createElement('DIV'); 
    radio50Div.classList.add('form-check'); 

    radio50Div.appendChild(radio50);  
    radio50Div.appendChild(radio50Label);
    

    // Agregar al Div Principal
    divFormulario.appendChild(heading); // div (divFormulario) → heading (h1/h2/h3 etc.) cuelga dentro de divFormulario
    divFormulario.appendChild(radio10Div); // div (divFormulario) → radio10Div (div con radio+label) cuelga dentro de divFormulario
    divFormulario.appendChild(radio25Div);
    divFormulario.appendChild(radio50Div);

    // Agregar al Formulario
    formulario.appendChild(divFormulario); // div (formulario) → divFormulario (div que contiene título y radio) cuelga dentro de formulario

    contenido.appendChild(formulario); // div (contenido) → formulario (div grande) cuelga dentro de contenido
}

function calcularPropina() {
    
    const  {pedido} = cliente; // extraigo el pedido del cliente
    let subtotal = 0;

    // Calcular el subtotal a pagar
    pedido.forEach(articulo => { // creamos la variable temporal de articulo  (es “temporal” porque su scope está en ese callback del forEach)
        subtotal += articulo.cantidad * articulo.precio; //  En cada artículo del pedido, suma al subtotal: cantidad * precio.

    })

    // Seleccionar el Radio Button con la propina del cliente
    const propinaSeleccionada = document.querySelector('[name="propina"]:checked').value;
    
    // Calcular la propina regla de tres
    const propina = ((subtotal * parseInt(propinaSeleccionada)) / 100);// 10%: subtotal * 10 / 100

    // Calcular el total a pagar
    const total = subtotal + propina;
 
    mostrarTotalHTML(subtotal,total,propina);
}
function mostrarTotalHTML(subtotal,total,propina) {

        const divTotales = document.createElement('DIV');
        divTotales.classList.add('total-pagar','my-5'); // clase vacia

        // Subtotal scripting 
        const subtotalParrafo = document.createElement('P');
        subtotalParrafo.classList.add('fs-4','fw-bold','mt-2');
        subtotalParrafo.textContent = 'Subtotal Consumo: ';

        const subtotalSpan = document.createElement('SPAN');
        subtotalSpan.classList.add('fw-normal');
        subtotalSpan.textContent = `${subtotal} €`;

        subtotalParrafo.appendChild(subtotalSpan); // lo que esta entre parentesis se mete dentro

        // Propina
        const propinaParrafo = document.createElement('P');
        propinaParrafo.classList.add('fs-4','fw-bold','mt-2');
        propinaParrafo.textContent = 'Propina: ';

        const propinaSpan = document.createElement('SPAN');
        propinaSpan.classList.add('fw-normal');
        propinaSpan.textContent = `${propina} €`;

        propinaParrafo.appendChild(propinaSpan); 

        // total
        const totalParrafo = document.createElement('P');
        totalParrafo.classList.add('fs-4','fw-bold','mt-2');
        totalParrafo.textContent = 'Total: ';

        const totalSpan = document.createElement('SPAN');
        totalSpan.classList.add('fw-normal');
        totalSpan.textContent = `${total} €`;

        totalParrafo.appendChild(totalSpan); 

        // Eliminar el ultimo resultado
        const totalPagarDiv = document.querySelector('.total-pagar');
        if(totalPagarDiv) { // "si existe.."
            totalPagarDiv.remove();
        } 

        divTotales.appendChild(subtotalParrafo);
        divTotales.appendChild(propinaParrafo);
        divTotales.appendChild(totalParrafo)

        const formulario = document.querySelector('.formulario > div'); // donde tengo el selector de formulario que seleccione el primer div
        formulario.appendChild(divTotales);

}   








// Parámetros y argumentos sirven para pasar información entre funciones.
// function sumar(a, b) { // a y b = parámetros
//   return a + b;
// }

// sumar(2, 3); // 2 y 3 = argumentos
// sumar(10, 5); // misma función, otros argumentos


