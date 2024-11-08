const container = document.getElementById("container");
let impresoraNOMBRE = "";
// IPA = $4000, GOLDEN= $3500, HONEY=$3500, PALE=$3500, VASO=$500

const precio = {
  ipa: 4000,
  golden: 3500,
  honey: 3500,
  pale: 3500,
  vaso: 500,
};

let venta = {
  fecha: new Date(),
  estilo: {
    ipa: 0,
    golden: 0,
    honey: 0,
    pale: 0,
    vaso: 0,
  },
  total: 0,
  pago: {
    efectivo: 0,
    qrmercadopago: 0,
    transferencia: 0,
  },
};

const selectImpresora = document.getElementById("impresoras");

selectImpresora.addEventListener("change", (e) => {
  impresoraNOMBRE = e.target.value;
  console.log(impresoraNOMBRE);
});

// Toast

const toastElem = document.getElementById("liveToast");

const toast = bootstrap.Toast.getOrCreateInstance(toastElem);

// imprimir comanda

const imprimirComanda = async (estilo) => {
  let nombreImpresora = impresoraNOMBRE;
  let api_key = "123456";

  const conector = new connetor_plugin();
  conector.fontsize("2");
  conector.textaling("center");
  conector.text("CINCO SABIOS");
  conector.fontsize("1");
  conector.feed("3");
  conector.text("Cerveceria Artesanal");
  conector.fontsize("3");
  conector.textaling("center");
  conector.text(estilo);
  conector.feed("3");
  conector.cut("0");

  const resp = await conector.imprimir(nombreImpresora, api_key);
  if (resp === true) {
    console.log("Impresion exitosa");
  } else {
    console.log("Problema al imprimir: " + resp);
  }
};

// seleccion con botones de opciones para imprimir comanda de estilo de cerveza

const dibujarBoton = (opciones) => {
  let div = document.createElement("div");
  div.classList.add("text-center", "m-3", "row");
  opciones.forEach((opcion) => {
    const btn = document.createElement("button");
    btn.innerHTML = opcion;
    btn.classList.add(
      "btn",
      "btn-primary",
      "m-1",
      "mt-2",
      "p-3",
      "col",
      "fs-1",
      "pb-5",
      "pt-5"
    );
    if (opcion === "IPA") {
      btn.onclick = () => {
        venta.total += precio.ipa;
        venta.estilo.ipa += 1;
      };
    } else if (opcion === "GOLDEN") {
      btn.onclick = () => {
        venta.total += precio.golden;
        venta.estilo.golden += 1;
      };
    } else if (opcion === "HONEY") {
      btn.onclick = () => {
        venta.total += precio.honey;
        venta.estilo.honey += 1;
      };
    } else if (opcion === "PALE ALE") {
      btn.onclick = () => {
        venta.total += precio.pale;
        venta.estilo.pale += 1;
      };
    } else if (opcion === "VASO") {
      btn.onclick = () => {
        venta.total += precio.vaso;
        venta.estilo.vaso += 1;
      };
    }
    div.appendChild(btn);
  });
  return div;
};

const modalBody = document.getElementById("modal-body");

const mostrarResumen = () => {
  modalBody.innerHTML = "";
  const estilos = ["ipa", "golden", "honey", "pale", "vaso"];
  estilos.forEach((estilo) => {
    const div = document.createElement("div");
    div.classList.add(
      "d-flex",
      "justify-content-between",
      "align-items-center",
      "mb-2"
    );
    const p = document.createElement("h4");
    p.innerHTML = `${estilo.toUpperCase()}: ${venta.estilo[estilo]}`;
    const btnMinus = document.createElement("button");
    btnMinus.innerHTML = "-";
    btnMinus.classList.add("btn", "btn-danger", "m-1");
    btnMinus.onclick = () => {
      if (venta.estilo[estilo] > 0) {
        venta.estilo[estilo] -= 1;
        venta.total -=
          estilo === "ipa"
            ? precio.ipa
            : estilo === "vaso"
              ? precio.vaso
              : precio.honey;
        mostrarResumen();
      }
    };
    const btnPlus = document.createElement("button");
    btnPlus.innerHTML = "+";
    btnPlus.classList.add("btn", "btn-success", "m-1");
    btnPlus.onclick = () => {
      venta.estilo[estilo] += 1;
      venta.total +=
        estilo === "ipa"
          ? precio.ipa
          : estilo === "vaso"
            ? precio.vaso
            : precio.honey;
      mostrarResumen();
    };
    div.appendChild(btnMinus);
    div.appendChild(p);
    div.appendChild(btnPlus);
    modalBody.appendChild(div);
  });
  let h2 = document.createElement("h2");
  h2.innerHTML = "Total: $" + venta.total;
  modalBody.appendChild(h2);
};

const mostrarOpciones = () => {
  container.innerHTML = "Seleccione una opcion";
  container.appendChild(dibujarBoton(["GOLDEN", "IPA"]));
  container.appendChild(dibujarBoton(["HONEY", "PALE ALE"]));
  container.appendChild(dibujarBoton(["VASO"]));
  let btn = document.createElement("button");
  btn.innerHTML = "RESUMEN";
  btn.classList.add("btn", "btn-success", "m-1");
  btn.onclick = mostrarResumen;
  btn.setAttribute("data-bs-toggle", "modal");
  btn.setAttribute("data-bs-target", "#exampleModal");
  container.appendChild(btn);
};

// mostrar impresoras

const mostrar_impresoras = () => {
  connetor_plugin.obtenerImpresoras().then((impresoras) => {
    selectImpresora.innerHTML = "";
    impresoras.forEach((impresora) => {
      const option = document.createElement("option");
      option.value = impresora;
      option.innerHTML = impresora;
      if (
        impresora !== "OneNote for Windows 10" &&
        impresora !== "Microsoft Print to PDF" &&
        impresora !== "Microsoft XPS Document Writer" &&
        impresora !== "Fax" &&
        impresora !== "Send To OneNote 2016" &&
        impresora !== "Microsoft Print to PDF" &&
        impresora !== "OneNote (Desktop)"
      ) {
        option.selected = true;
        impresoraNOMBRE = impresora;
      }
      selectImpresora.appendChild(option);
    });
  });
};

document.addEventListener("DOMContentLoaded", () => {
  // mostrar_impresoras();
  mostrarOpciones();
});

const botonesCancelar = document.querySelectorAll(".cancelar");

const btnConfirmar = document.getElementById("btnConfirmar");

botonesCancelar.forEach((btn) => {
  btn.addEventListener("click", () => {
    venta = {
      fecha: new Date(),
      estilo: {
        ipa: 0,
        golden: 0,
        honey: 0,
        pale: 0,
        vaso: 0,
      },
      total: 0,
      pago: {
        efectivo: 0,
        qrmercadopago: 0,
        transferencia: 0,
      },
    };
  });
});

const modalPagoBody = document.getElementById("modalPago");
let selectedPagos = [];

const mostrarPago = () => {
  modalPagoBody.innerHTML = "";
  let h2 = document.createElement("h2");
  h2.innerHTML = "Total: $" + venta.total;
  modalPagoBody.appendChild(h2);
  const pagos = ["efectivo", "qrmercadopago", "transferencia"];
  selectedPagos = [];

  let divCheck = document.createElement("div");
  divCheck.classList.add(
    "d-flex",
    "justify-content-between",
    "mb-2",
    "form-check",
    "form-check-inline"
  );
  pagos.forEach((pago) => {
    const div = document.createElement("div");
    div.classList.add("d-flex", "mb-2");

    const label = document.createElement("label");
    label.innerHTML = pago.toUpperCase();
    label.classList.add("form-check-label");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.classList.add("form-check-input");
    checkbox.onchange = () => {
      if (checkbox.checked) {
        selectedPagos.push(pago);
      } else {
        selectedPagos = selectedPagos.filter((item) => item !== pago);
      }
      updateInputs();
      toggleConfirmButton();
    };

    div.appendChild(checkbox);
    div.appendChild(label);
    divCheck.appendChild(div);
  });
  modalPagoBody.appendChild(divCheck);

  const updateInputs = () => {
    const existingInputs = document.querySelectorAll(".pago-input");
    existingInputs.forEach((input) => input.remove());
    selectedPagos.forEach((pago) => {
      if (selectedPagos.length != 1) {
        const div = document.createElement("div");
        div.classList.add("pago-input", "mb-2");
        const input = document.createElement("input");
        input.type = "number";
        input.placeholder = `Monto para ${pago.toUpperCase()}`;
        input.classList.add("form-control");
        const label = document.createElement("label");
        label.innerHTML = pago.toUpperCase();
        label.classList.add("form-check-label", "mt-2");
        div.appendChild(label);
        div.appendChild(input);
        modalPagoBody.appendChild(div);
      }
    });
  };

  const toggleConfirmButton = () => {
    btnConfirmar.disabled = selectedPagos.length === 0;
  };

  toggleConfirmButton();
};

let btnSiguiente = document.getElementById("btnSiguiente");
btnSiguiente.addEventListener("click", mostrarPago);

const modalGuardarBody = document.getElementById("modalGuardar");

const mostrarDetalleVenta = () => {
  modalGuardarBody.innerHTML = "";
  const estilos = ["ipa", "golden", "honey", "pale", "vaso"];
  estilos.forEach((estilo) => {
    const div = document.createElement("div");
    div.classList.add(
      "d-flex",
      "justify-content-between",
      "align-items-center",
      "mb-2"
    );
    const p = document.createElement("h4");
    p.innerHTML = `${estilo.toUpperCase()}: ${venta.estilo[estilo]}`;
    div.appendChild(p);
    modalGuardarBody.appendChild(div);
  });
  let h2 = document.createElement("h2");
  h2.innerHTML = "Total: $" + venta.total;
  modalGuardarBody.appendChild(h2);

  const pagos = ["efectivo", "qrmercadopago", "transferencia"];
  pagos.forEach((pago) => {
    if (venta.pago[pago] > 0) {
      const div = document.createElement("div");
      div.classList.add(
        "d-flex",
        "justify-content-between",
        "align-items-center",
        "mb-2"
      );
      const p = document.createElement("h4");
      p.innerHTML = `${pago.toUpperCase()}: $${venta.pago[pago]}`;
      div.appendChild(p);
      modalGuardarBody.appendChild(div);
    }
  });
  console.log(impresoraNOMBRE);
};

btnConfirmar.addEventListener("click", () => {
  if (selectedPagos.length === 1) {
    venta.pago[selectedPagos[0]] = venta.total;
  } else {
    selectedPagos.forEach((pago) => {
      const input = document.querySelector(
        `input[placeholder="Monto para ${pago.toUpperCase()}"]`
      );
      venta.pago[pago] = input.value;
    });
  }
  mostrarDetalleVenta();
});

const btnGuardar = document.getElementById("btnGuardar");

btnGuardar.addEventListener("click", async () => {
  venta.fecha = new Date();
  await fetch("/venta/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(venta),
  })
    .then((res) => res.json())
    .then((data) => {
      // const estilos = ["ipa", "golden", "honey", "pale", "vaso"];
      // estilos.forEach((estilo) => {
      //   for (let i = 0; i < venta.estilo[estilo]; i++) {
      //     imprimirComanda(estilo.toUpperCase());
      //   }
      // });
      toast.show();
      venta = {
        estilo: {
          ipa: 0,
          golden: 0,
          honey: 0,
          pale: 0,
          vaso: 0,
        },
        total: 0,
        pago: {
          efectivo: 0,
          qrmercadopago: 0,
          transferencia: 0,
        },
      };
    })
    .catch((error) => {
      console.error("Error en la solicitud:", error);
      alert("Error al guardar la venta, intente nuevamente");
    });
});
