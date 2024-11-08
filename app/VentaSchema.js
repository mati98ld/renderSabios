import mongoose from "mongoose";

const VentaSchema = new mongoose.Schema({
  fecha: {
    type: Date,
    required: true,
  },
  estilo: {
    ipa: {
      type: Number,
      required: true,
    },
    golden: {
      type: Number,
      required: true,
    },
    honey: {
      type: Number,
      required: true,
    },
    pale: {
      type: Number,
      required: true,
    },
    vaso: {
      type: Number,
      required: true,
    },
  },
  total: {
    type: Number,
    required: true,
  },
  pago: {
    efectivo: {
      type: Number,
      required: true,
    },
    qrmercadopago: {
      type: Number,
      required: true,
    },
    transferencia: {
      type: Number,
      required: true,
    },
  },
  borrada: {
    type: Boolean,
    required: true,
  },
});
export const Venta = mongoose.model("Venta", VentaSchema);
