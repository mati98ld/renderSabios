const container = document.getElementById("container");
const dibujarTotal = () => {
  fetch("/venta/total")
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      const totalElement = document.createElement("div");
      totalElement.classList.add(
        "card",
        "m-3",
        "col",
        "justify-content-center",
        "text-center"
      );
      totalElement.innerHTML = `
      <h1 class="m-3 text-primary">Total de ventas</h1>
          <div class="card-body">
        <h3 class="card-text text-danger">Estilos:</h3>
        <h5 class="card-text">IPA: ${data.ipa}</h5>
        <h5 class="card-text">GOLDEN: ${data.golden}</h5>
        <h5 class="card-text">HONEY: ${data.honey}</h5>
        <h5 class="card-text">PALE ALE: ${data.pale}</h5>
        <h5 class="card-text">VASOS: ${data.vaso}</h5>
        <h3 class="card-text text-danger">Métodos de pago:</h3>
        <h5 class="card-text">EFECTIVO: $${data.efectivo}</h5>
        <h5 class="card-text">QR MercadoPago: $${data.qrmercadopago}</h5>
        <h5 class="card-text">TRANSFERENCIA: $${data.transferencia}</h5>
        <h1 class="card-text mt-4 text-success">TOTAL: $${data.total}</h1>
        <h4 class="card-text">TOTAL DE VASOS: $${data.vaso * 500}</h4>
          </div>
        `;
      container.appendChild(totalElement);
    })
    .catch((err) => {
      console.error(err);
    });
};

document.addEventListener("DOMContentLoaded", () => {
  dibujarTotal();
});
