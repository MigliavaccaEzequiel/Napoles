let nombreCliente = prompt("Ingrese su nombre y apellido para dientificar el pedido");
//Verificar que no este vacio para saber a quien entregarle el pedido
while (!nombreCliente || nombreCliente.trim() === "") {
    alert("Debe ingresar un nombre para identificar el pedido.");
    nombreCliente = prompt("Por favor, ingrese su nombre y apellido para identificar el pedido.");
}
console.log(`Cliente: ${nombreCliente}`);
alert(`¡Bienvenido ${nombreCliente}!`);

let pedido = [];
let opcion = "";

//Funcion para generar pedido o agregar productos
function generarPedido() {
    let eleccion = prompt("Elegí una pizza para agregar al pedido:\n1 - Muzzarella ($6000)\n2 - Especial ($7000)\n3 - Especial Nápoles ($7500)");
    let cantidad = parseInt(prompt("¿Cuántas unidades querés agregar?"));
  
    if (isNaN(cantidad) || cantidad <= 0) {
        alert("Cantidad inválida. No se agregó nada al pedido.");
        return;
    }
  
    let producto = {};
  
    switch (eleccion) {
        case "1":
            producto = { nombre: "Muzzarella", precio: 6000, cantidad };
            break;
        case "2":
            producto = { nombre: "Especial", precio: 7000, cantidad };
            break;
        case "3":
            producto = { nombre: "Especial Nápoles", precio: 7500, cantidad };
            break;
            default:
        alert("Opción no válida. No se agregó ninguna pizza.");
        return;
    }
  
    pedido.push(producto);
    console.log("Producto agregado:", producto);
    console.log("Pedido actual:", pedido);
    alert(`Agregaste ${cantidad} ${producto.nombre}(s) al pedido.`);
}

//Funcion para armar el resumen actual del pedido
function mostrarResumenPedido(pedido) {
    let resumen = "";
    let total = 0;
  
    for (let i of pedido) {
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
            pedido.length = 0;
            console.log("El usuario canceló el pedido.");
            alert("Tu pedido fue cancelado.");
        }
        return false;
    }
}

//Funcion para mostrar el pedido actual y confirmarlo o cancelarlo
function revisarPedido() {
    if (pedido.length === 0) {
      alert("No hay productos en el pedido aún.");
      return;
    }
  
    const { resumen, total } = mostrarResumenPedido(pedido);
    alert("Tu pedido actual es:\n" + resumen + `Total: $${total}`);
  
    const confirmado = confirmarPedido(total);
    if (confirmado) {
        opcion = "3";
    }
}

//Listado de opciones
while (opcion !== "3") {
    opcion = prompt("¿Qué desea hacer?\n1- Generar pedido o agregar otro producto.\n2- Revisar pedido.\n3- Salir.");
  
    switch (opcion) {
        case "1":
            generarPedido();
            break;
      
        case "2":
            revisarPedido();
            break;
      
        case "3":
            if (pedido.length === 0) {
              alert(`Hasta luego, ${nombreCliente}. No se generó ningún pedido.`);
            } else {
              alert(`Hasta luego, ${nombreCliente}. Tu pedido fue registrado, gracias.`);
            }
            break;
      
        default:
          alert("Opción no válida. Por favor, elegí una opción del menú.");
    }
}

