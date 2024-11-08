const container = document.getElementById("container");

/*    const venta = new Venta();
    venta.fecha = req.body.fecha;
    venta.estilo = req.body.estilo = {ipa: 0, golden: 0, honey: 0, pale: 0, vaso: 0};
    venta.total = req.body.total;
    venta.pago = req.body.pago = {efectivo: 0, qrmercadopago: 0, transferencia: 0};
    venta.borrada = false;*/

const borrar = (id) => {
  fetch(`/venta/historial/${id}`, {
    method: "DELETE",
  }).then(() => {
    console.log("Venta borrada");
    container.innerHTML = "";
    dibujarHistorial();
  });
};

const btnBorrar = document.getElementById("btnBorrar");

btnBorrar.addEventListener("click", () => {
  borrar(btnBorrar.value);
});

const dibujarHistorial = () => {
  fetch("/venta/historial")
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      data.forEach((venta) => {
        let estilos = ["ipa", "golden", "honey", "pale", "vaso"];
        let pagos = ["efectivo", "qrmercadopago", "transferencia"];
        if (venta.borrada) return;
        const ventaElement = document.createElement("div");
        ventaElement.classList.add(
          "card",
          "m-3",
          "col",
          "justify-content-center",
          "text-center"
        );
        ventaElement.innerHTML = `
          <div class="card-body d-flex flex-column justify-content-between">
            <h5 class="card-title">Fecha: ${new Date(venta.fecha).toLocaleDateString()}</h5>
            <h6 class="card-subtitle mb-2 text-muted">Hora: ${new Date(venta.fecha).toLocaleTimeString()}</h6>
            <h4 class="card-text">Estilos:</h4>
            ${estilos
              .map((estilo) =>
                venta.estilo[estilo] == 0
                  ? ""
                  : `<p class="card-text">${estilo.toUpperCase()}: ${venta.estilo[estilo]}</p>`
              )
              .filter((estilo) => estilo !== "")
              .join("")}
            <h4 class="card-text">Método de pago:</h4>
            ${pagos
              .map((pago) => {
                if (venta.pago[pago] == 0) {
                  return "";
                } else {
                  return `<p class="card-text">${pago.toUpperCase()}: $${venta.pago[pago]}</p>`;
                }
              })
              .filter((pago) => pago !== "")
              .join("")}
            <h4 class="card-text">Total: $${venta.total}</h4>
            <button class="btn btn-danger mt-3" data-bs-toggle="modal" data-bs-target="#exampleModal">BORRAR</button>
          </div>
        `;
        ventaElement.querySelector("button").onclick = function () {
          btnBorrar.value = venta._id;
        };
        container.appendChild(ventaElement);
      });
    });
};

document.addEventListener("DOMContentLoaded", dibujarHistorial);
