let nombreCliente = prompt("Ingrese su nombre y apellido para dientificar el pedido");
//Verificar que no este vacio para saber a quien entregarle el pedido
while (!nombreCliente || nombreCliente.trim() === "") {
    alert("Debe ingresar un nombre para identificar el pedido.");
    nombreCliente = prompt("Por favor, ingrese su nombre y apellido para identificar el pedido.");
}
console.log(`Cliente: ${nombreCliente}`);
alert(`¡Bienvenido ${nombreCliente}!`);
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

const pedido = {
  cliente: nombreCliente,
  id: generarIdPedido(),
  productos: []
};
let opcion = "";

//Funcion para generar pedido o agregar productos
function generarPedido() {
    const categoria = prompt("Elegí una categoría:\n0 - Volver\n1 - Pizzas\n2 - Sándwiches\n3 - Bebidas\n4 - Ver todo");
    let categoriaElegida = "";

    switch (categoria) {
        case "0":
            return;
        case "1":
            categoriaElegida = "pizza";
            break;
        case "2":
            categoriaElegida = "sanguche";
            break;
        case "3":
            categoriaElegida = "bebida";
            break;
        case "4":
            categoriaElegida = "";
            break;
        default:
            alert("Categoría no válida.");
            return;
    }

    // Filtrar catálogo
    let opciones;

    if (categoriaElegida) {
        opciones = catalogo.filter(function(p) {
            return p.categoria === categoriaElegida;
        });
    } else {
        opciones = catalogo;
    }

    // Mostrar productos
    let mensaje = "Elegí un producto:\n";
    opciones.forEach((p, i) => {
        mensaje += `${i + 1} - ${p.nombre} ($${p.precio})\n`;
    });
    mensaje += "0 - Volver";

    const seleccion = parseInt(prompt(mensaje));
    if (seleccion === 0) return;

    const productoElegido = opciones[seleccion - 1];

    if (!productoElegido) {
        alert("Opción inválida.");
        return;
    }

    const cantidad = parseInt(prompt(`¿Cuántas unidades de ${productoElegido.nombre} querés agregar?`));
    if (isNaN(cantidad) || cantidad <= 0) {
        alert("Cantidad inválida. No se agregó nada al pedido.");
        return;
    }

    const existente = pedido.productos.find(p => p.id === productoElegido.id);

    if (existente) {
        existente.cantidad += cantidad;
        alert(`Actualizaste ${productoElegido.nombre}. Nueva cantidad: ${existente.cantidad}`);
    } else {
        pedido.productos.push({
            id: productoElegido.id,
            nombre: productoElegido.nombre,
            precio: productoElegido.precio,
            cantidad: cantidad
        });
        alert(`Agregaste ${cantidad} ${productoElegido.nombre}(s) al pedido.`);
    }

    console.log("Pedido actual:", pedido.productos);
}

//Funcion para eliminar un producto no deseado
function eliminarProducto() {
    if (pedido.productos.length === 0) {
        alert("No hay productos para eliminar.");
        return;
    }

    let mensaje = "Elegí un producto para eliminar:\n";
    pedido.productos.forEach((p, i) => {
        mensaje += `${i + 1} - ${p.nombre} (Cantidad: ${p.cantidad})\n`;
    });
    mensaje += "0 - Volver";

    let opcion = prompt(mensaje);
    if (opcion === "0") return;

    let indice = parseInt(opcion) - 1;
    if (isNaN(indice) || indice < 0 || indice >= pedido.productos.length) {
        alert("Opción inválida.");
        return;
    }

    const producto = pedido.productos[indice];
    const accion = prompt(`Seleccionaste ${producto.nombre} (Cantidad actual: ${producto.cantidad})\n¿Querés eliminar:\n1 - Todo el producto\n2 - Solo una cantidad`).trim();

    if (accion === "1") {
        pedido.productos.splice(indice, 1);
        alert(`${producto.nombre} fue eliminado del pedido.`);
    } else if (accion === "2") {
        const cantidadAEliminar = parseInt(prompt(`¿Cuántas unidades querés eliminar?`));
        if (isNaN(cantidadAEliminar) || cantidadAEliminar <= 0) {
            alert("Cantidad inválida.");
            return;
        }

        if (cantidadAEliminar >= producto.cantidad) {
            pedido.productos.splice(indice, 1);
            alert(`Se eliminaron todas las unidades de ${producto.nombre}.`);
        } else {
            producto.cantidad -= cantidadAEliminar;
            alert(`Se eliminaron ${cantidadAEliminar} unidades. Quedan ${producto.cantidad}.`);
        }
    } else {
        alert("Opción inválida.");
    }
}

//Funcion para armar el resumen actual del pedido
function mostrarResumenPedido(productos) {
    let resumen = "";
    let total = 0;
  
    for (let i of productos) {
        let subtotal = i.precio * i.cantidad;
        resumen += `${i.nombre} x${i.cantidad} = $${subtotal}\n`;
        total += subtotal;
    }
  
    return { resumen, total };
}

//Funcion para confirmar o cancelar el pedido con validacion afirmativa o negativa
function confirmarPedido(total) {
    let confirmar;
  
    do {
        confirmar = prompt("¿Deseás confirmar el pedido? (s/n)").toLowerCase().trim();
    } while (confirmar !== "s" && confirmar !== "n");
  
    if (confirmar === "s") {
        alert(`¡Gracias por tu pedido, ${nombreCliente}! El total es $${total}. Pronto estará listo.`);
        console.log("Pedido confirmado. Total:", total);
        return true;
    } else {
        let cancelar;
  
        do {
            cancelar = prompt("¿Querés cancelar el pedido? (s/n)").toLowerCase().trim();
        } while (cancelar !== "s" && cancelar !== "n");
  
        if (cancelar === "s") {
            pedido.productos.length = 0;
            console.log("El usuario canceló el pedido.");
            alert("Tu pedido fue cancelado.");
        }
        return false;
    }
}

//Funcion para cargar los pedidos guardados
function cargarPedidos() {
   const pedidosGuardados = localStorage.getItem("pedidos");
   if (pedidosGuardados) {
      return JSON.parse(pedidosGuardados);
   }
   return [];
}

//Función para generar un ID basado en la cantidad de pedidos previos
function generarIdPedido() {
    const pedidos = cargarPedidos();
    return pedidos.length + 1;
}

//Funcion para mostrar el pedido actual y confirmarlo o cancelarlo
function revisarPedido() {
    if (pedido.productos.length === 0) {
      alert("No hay productos en el pedido aún.");
      return;
    }
  
    const { resumen, total } = mostrarResumenPedido(pedido.productos);
    alert("Tu pedido actual es:\n" + resumen + `Total: $${total}`);
  
    const confirmado = confirmarPedido(total);
    if (confirmado) {
        let pedidosGuardados = cargarPedidos();
        pedidosGuardados.push(pedido);
        localStorage.setItem("pedidos", JSON.stringify(pedidosGuardados));
        console.log("Pedido guardado en localStorage.");
        opcion = "4";
    }
}

//Funcion para mostrar los pedidos.
function mostrarPedidosGuardados() {
    const pedidos = cargarPedidos();

    if (pedidos.length === 0) {
        alert("No hay pedidos guardados en el localStorage.");
        return;
    }

    let resumen = "Pedidos guardados:\n\n";
    pedidos.forEach((pedido, i) => {
        resumen += `Pedido ${i + 1} - Cliente: ${pedido.cliente}\n`;
        pedido.productos.forEach(prod => {
            resumen += `  ${prod.nombre} x${prod.cantidad} = $${prod.precio * prod.cantidad}\n`;
        });
        resumen += "------------------------\n";
    });

    alert(resumen);
}

//Listado de opciones
while (opcion !== "4") {
    opcion = prompt("¿Qué desea hacer?\n1- Generar pedido o agregar otro producto.\n2- Revisar pedido.\n3- Eliminar un producto.\n4- Salir.");
  
    switch (opcion) {
        case "1":
            generarPedido();
            break;
      
        case "2":
            revisarPedido();
            break;

        case "3":
            eliminarProducto();
            break;
      
        case "4":
            if (pedido.productos.length === 0) {
              alert(`Hasta luego, ${nombreCliente}. No se generó ningún pedido.`);
            } else {
                revisarPedido();
            }
            break;
      
        default:
          alert("Opción no válida. Por favor, elegí una opción del menú.");
    }
}