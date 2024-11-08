// Importar módulos necesarios
import express from "express";
import mongoose from "mongoose";
import { fileURLToPath } from "url";
import path from "path";
import cors from "cors";
import ejs from "ejs";
import { config as dotenv } from "dotenv";
import { Venta } from "./VentaSchema.js";

dotenv();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Inicializar la app de Express
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Configuración de vistas: lee los archivos .ejs de la carpeta views
app.set("views", path.join(__dirname, "..", "views"));
app.engine("html", ejs.renderFile);
app.set("view engine", "ejs");

// Conectar a la base de datos
const clientOptions = {
  serverApi: { version: "1", strict: true, deprecationErrors: true },
};

async function run() {
  try {
    // Crear un cliente de Mongoose
    await mongoose.connect(process.env.MONGODB_URI, clientOptions);
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } catch (err) {
    console.error("Error de conexión a MongoDB:", err);
  }
}
run();

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, "..", "public")));

// Configuración de rutas
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.post("/venta/add", async (req, res) => {
  try {
    const venta = new Venta();
    venta.fecha = req.body.fecha;
    venta.estilo = req.body.estilo;
    venta.total = req.body.total;
    venta.pago = req.body.pago;
    venta.borrada = false;
    await venta.save();
    res.status(201).send(venta);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

app.get("/venta/historial", async (req, res) => {
  try {
    const ventas = await Venta.find();
    res.status(200).send(ventas.reverse());
  } catch (err) {
    res.status(400).send(err.message);
  }
});

app.delete("/venta/historial/:id", async (req, res) => {
  try {
    const venta = await Venta.findById(req.params.id);
    venta.borrada = true;
    await venta.save();
    res.status(204).send(venta);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

app.get("/venta/total", async (req, res) => {
  try {
    const total = await Venta.find();
    const ventas = {
      ipa: 0,
      golden: 0,
      honey: 0,
      pale: 0,
      vaso: 0,
      total: 0,
      efectivo: 0,
      qrmercadopago: 0,
      transferencia: 0,
    };
    total.forEach((venta) => {
      if (venta.borrada) return;
      ventas.ipa += venta.estilo.ipa;
      ventas.golden += venta.estilo.golden;
      ventas.honey += venta.estilo.honey;
      ventas.pale += venta.estilo.pale;
      ventas.vaso += venta.estilo.vaso;
      ventas.total += venta.total;
      ventas.efectivo += venta.pago.efectivo;
      ventas.qrmercadopago += venta.pago.qrmercadopago;
      ventas.transferencia += venta.pago.transferencia;
    });
    res.status(200).send(ventas);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Configuración del puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
