// Descrição: Arquivo responsável pelo modelo do pagamento

const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const Schema = mongoose.Schema;

const PagamentoSchema = Schema({
  valor: { type: Number, required: true },
  forma: { type: String, required: true },
  parcelado: { type: Object },
  status: { type: String, required: true },
  pedido: { type: Schema.Types.ObjectId, ref: 'Pedido', required: true },
  loja: { type: Schema.Types.ObjectId, ref: 'Loja' },
  payload: { type: Object }
}, { timestamps: true });

PagamentoSchema.plugin(mongoosePaginate)

module.exports = mongoose.model('Pagamento', PagamentoSchema);