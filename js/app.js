let nombreCliente = "";
const inputNombreCliente = document.getElementById("inputNombreCliente");
const botonNombreCliente = document.getElementById("botonNombreCliente");

//Enviar nombre del cliente
botonNombreCliente.addEventListener("click", () => {
    const nombreIngresado = inputNombreCliente.value.trim();

    if (nombreIngresado === "") {
        mensajeBienvenida.innerText = "⚠️ Por favor, ingrese su nombre.";
        mensajeBienvenida.classList.add("text-danger");
        return;
    }

    nombreCliente = nombreIngresado;
    console.log(`Cliente: ${nombreCliente}`);

    mensajeBienvenida.innerText = `👋 ¡Bienvenido, ${nombreCliente}!`;
    mensajeBienvenida.classList.remove("text-danger");
    mensajeBienvenida.classList.add("text-warning");
    inputNombreCliente.disabled = true;
    botonNombreCliente.disabled = true;
});

//Badge del carrito
function actualizarBadgeCarrito() {
  const carritoBadge = document.getElementById("carritoBadge");
  const totalProductos = pedido.productos.reduce((acc, prod) => acc + prod.cantidad, 0);
  carritoBadge.textContent = totalProductos > 0 ? totalProductos : "";
}

//Modal carrito
function renderizarCarritoModal() {
  const modalCarrito = document.getElementById("contenidoCarrito");
  modalCarrito.innerHTML = "";

  if (pedido.productos.length === 0) {
    modalCarrito.innerHTML = "<p class='text-muted'>No hay productos en el pedido.</p>";
    return;
  }

  pedido.productos.forEach((producto) => {
    const item = document.createElement("div");
    item.className = "d-flex justify-content-between align-items-center border-bottom py-2";
    item.innerHTML = `
      <div>
        <strong>${producto.nombre}</strong><br>
        <small>$${producto.precio} x ${producto.cantidad} = $${producto.precio * producto.cantidad}</small>
      </div>
      <div>
        <button class="btn btn-sm btn-outline-secondary me-1" onclick="modificarCantidad(${producto.id}, -1)">-</button>
        <span>${producto.cantidad}</span>
        <button class="btn btn-sm btn-outline-secondary ms-1" onclick="modificarCantidad(${producto.id}, 1)">+</button>
      </div>
    `;
    modalCarrito.appendChild(item);
  });
}

//Modificar pedido dentro del modal
function modificarCantidad(idProducto, cambio) {
  const producto = pedido.productos.find(p => p.id === idProducto);
  if (!producto) return;

  producto.cantidad += cambio;
  if (producto.cantidad <= 0) {
    pedido.productos = pedido.productos.filter(p => p.id !== idProducto);
  }

  actualizarResumenPedido();
  actualizarBadgeCarrito();
  renderizarCarritoModal();
}

//Abrir carrito
document.getElementById("botonCarrito").addEventListener("click", () => {
  renderizarCarritoModal();
  const modal = new bootstrap.Modal(document.getElementById("modalCarrito"));
  modal.show();
});

//Boton confirmar Modal
document.getElementById("btnConfirmarModal").addEventListener("click", confirmarPedido);

//Boton cancelar Modal
document.getElementById("btnCancelarModal").addEventListener("click", cancelarPedido);

//Boton confirmar pedido
document.getElementById("btnConfirmar").addEventListener("click", confirmarPedido);

//Boton cancelar pedido
document.getElementById("btnCancelar").addEventListener("click", cancelarPedido);

const modalCarrito = document.getElementById("modalCarrito");
const botonCarrito = document.getElementById("botonCarrito");

if (modalCarrito && botonCarrito) {
    modalCarrito.addEventListener("hidden.bs.modal", () => {
        botonCarrito.focus();
    });
}

//botones de filtrado
const filtroTodos = document.getElementById("filtroTodos").addEventListener("click", () => filtrarCatalogo("todos"));
const filtroPizzas = document.getElementById("filtroPizzas").addEventListener("click", () => filtrarCatalogo("pizza"));
const filtroSanguches = document.getElementById("filtroSanguches").addEventListener("click", () => filtrarCatalogo("sanguche"));
const filtroBebidas = document.getElementById("filtroBebidas").addEventListener("click", () => filtrarCatalogo("bebida"));

//contenedores
const pedidosGuardados = document.getElementById("pedidosGuardados");
const listaProductos = document.getElementById("listaProductos");
const resumenPedido = document.getElementById("resumenPedido");

mostrarPedidosGuardados();

const catalogo = [
    {id: 1, codigo: "M", nombre:"Muzzarella", categoria: "pizza", precio: 6000},
    {id: 2, codigo: "E", nombre:"Especial", categoria: "pizza", precio: 7000},
    {id: 3, codigo: "EN", nombre:"Especial Nápoles", categoria: "pizza", precio: 7500},
    {id: 4, codigo: "J", nombre:"Juanacho", categoria: "sanguche", precio: 4000},
    {id: 5, codigo: "C", nombre:"Carlitos (tostado)", categoria: "sanguche", precio: 5500},
    {id: 6, codigo: "CV", nombre:"Coca-Cola de Vidrio 1.5 Lt", categoria: "bebida", precio: 3500},
    {id: 7, codigo: "BL", nombre:"Cerveza Brhama 1 Lt", categoria: "bebida", precio: 3500},
];

mostrarProductos(catalogo);

const pedido = {
    cliente: nombreCliente,
    id: generarIdPedido(),
    productos: []
};
let opcion = "";

//Funcion para renderizar el catalogo en el DOM
function mostrarProductos(lista) {
    listaProductos.innerHTML = "";
    
    lista.forEach((producto) => {
        const div = document.createElement("div");
        div.className = "card m-2 p-2";
        div.innerHTML = `
        <p class="fs-4 fw-bold">${producto.nombre}</p>
        <p class="mb-1">Precio: <strong>$${producto.precio}</strong></p>
        <div class="g-2 text-center">
        <button class="btn btn-danger btn-sm" onclick="restarDelPedido(${producto.id})">-</button>
        <button class="btn btn-success btn-sm" onclick="sumarAlPedido(${producto.id})">+</button>
      </div>
        `;
        listaProductos.appendChild(div);
    });
}

function filtrarCatalogo(categoria) {
    if (categoria === "todos") {
        mostrarProductos(catalogo);
    } else {
        const filtrado = catalogo.filter(p => p.categoria === categoria);
        mostrarProductos(filtrado);
    }
}

//Funcion para agregar productos
function sumarAlPedido(id) {
  const producto = catalogo.find(p => p.id === id);
  if (!producto) return;

  const existente = pedido.productos.find(p => p.id === id);

  if (existente) {
    existente.cantidad++;
  } else {
    pedido.productos.push({ id: producto.id, nombre: producto.nombre, precio: producto.precio, cantidad: 1 });
  }

  actualizarResumenPedido();
  actualizarBadgeCarrito();
}

//Funcion para quitar productos
function restarDelPedido(id) {
  const indice = pedido.productos.findIndex(p => p.id === id);
  if (indice === -1) return;

  pedido.productos[indice].cantidad--;

  if (pedido.productos[indice].cantidad <= 0) {
    pedido.productos.splice(indice, 1);
  }

  actualizarResumenPedido();
  actualizarBadgeCarrito();
}

//Funcion para renderizar el resumen del pedido
function actualizarResumenPedido() {
  resumenPedido.innerHTML = "";

  if (pedido.productos.length === 0) {
    resumenPedido.innerHTML = "<p>No hay productos en el pedido.</p>";
    return;
  }

  pedido.productos.forEach(p => {
    const linea = document.createElement("p");
    linea.innerText = `${p.nombre} x${p.cantidad} - $${p.precio * p.cantidad}`;
    resumenPedido.appendChild(linea);
  });

  const total = pedido.productos.reduce((acc, p) => acc + p.precio * p.cantidad, 0);
  const verTotal = document.createElement("p");
  verTotal.className = "fw-bold mt-2";
  verTotal.innerText = `Total: $${total}`;
  resumenPedido.appendChild(verTotal);
}

//Funcion confirmar pedido
function confirmarPedido() {
    pedido.cliente = nombreCliente;

    if (!pedido.cliente || pedido.cliente.trim() === "") {
        Swal.fire({
            icon: "warning",
            title: "Nombre requerido",
            text: "Por favor ingresá tu nombre antes de confirmar el pedido."
        });
        return;
    }

    if (pedido.productos.length === 0) {
        Swal.fire({
            icon: "info",
            title: "Carrito vacío",
            text: "No hay productos en el pedido."
        });
        return;
    }

    const pedidosGuardados = JSON.parse(localStorage.getItem("pedidos")) || [];
    pedidosGuardados.push(pedido);
    localStorage.setItem("pedidos", JSON.stringify(pedidosGuardados));

    pedido.productos = [];
    actualizarResumenPedido();
    actualizarBadgeCarrito();
    renderizarCarritoModal();

    Swal.fire({
        icon: "success",
        title: "¡Pedido confirmado!",
        text: "Gracias por tu compra 😊"
    });
}

//Funcion cancelar pedido
function cancelarPedido() {
    if (pedido.productos.length === 0) {
        Swal.fire({
            icon: "info",
            title: "Carrito vacío",
            text: "No hay nada para cancelar."
        });
        return;
    }

    Swal.fire({
        title: "¿Cancelar pedido?",
        text: "Se eliminarán todos los productos del pedido actual.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Sí, cancelar",
        cancelButtonText: "Volver"
    }).then((result) => {
        if (result.isConfirmed) {
            pedido.productos = [];
            actualizarResumenPedido();
            actualizarBadgeCarrito();
            renderizarCarritoModal();

            Swal.fire({
                icon: "success",
                title: "Pedido cancelado",
                text: "El pedido fue eliminado correctamente."
            });
        }
    });
}

//Funcion para cargar los pedidos guardados
function cargarPedidos() {
   const pedidosEnStorage = localStorage.getItem("pedidos");
   if (pedidosEnStorage) {
      return JSON.parse(pedidosEnStorage);
   }
   return [];
}

//Función para generar un ID basado en la cantidad de pedidos previos
function generarIdPedido() {
    const pedidos = cargarPedidos();
    return pedidos.length + 1;
}

//Funcion para mostrar los pedidos.
function mostrarPedidosGuardados() {
    const pedidos = cargarPedidos();
    if (pedidos.length === 0) {
        pedidosGuardados.innerHTML = "<p>No hay pedidos anteriores guardados.</p>";
        return;
    }

    pedidosGuardados.innerHTML = pedidos.map((pedido, i) => {
        const productos = pedido.productos.map(
            prod => `<li>${prod.nombre} x${prod.cantidad} = $${prod.precio * prod.cantidad}</li>`
        ).join("");

        return `
            <div class="card mb-3">
                <div class="card-body">
                    <p class="card-title fw-bold fs-5">Pedido ${i + 1} - Cliente: ${pedido.cliente}</p>
                    <ul>${productos}</ul>
                </div>
            </div>
        `;
    }).join("");
}

actualizarResumenPedido();