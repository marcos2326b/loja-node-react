// Descrição: Arquivo responsável por todas as rotas dos pedidos

const router = require('express').Router()
const auth = require('../../auth')
const Validation = require('express-validation')

const PedidoController = require('../../../controllers/PedidoController')
const pedidoController = new PedidoController()

const { LojaValidation } = require('../../../controllers/validations/lojaValidation')
const { PedidoValidation } = require('../../../controllers/validations/pedidoValidation')

// ----------------------------------------- ADMIN -------------------------------------------
// /v1/api/pedidos/admin - TESTADO
router.get('/admin', auth.required, LojaValidation.admin, Validation(PedidoValidation.indexAdmin), pedidoController.indexAdmin)
// /v1/api/clientes/avaliacoes/admin/:id - TESTADO
router.get('/admin/:id', auth.required, LojaValidation.admin, Validation(PedidoValidation.showAdmin), pedidoController.showAdmin)

// /v1/api/clientes/avaliacoes/admin/:id - TESTADO
router.delete('/admin/:id', auth.required, LojaValidation.admin, Validation(PedidoValidation.removeAdmin), pedidoController.removeAdmin)

// -- Carrinho
// /v1/api/pedidos/admin/:id/carrinho - TESTADO
router.get('/admin/:id/carrinho', auth.required, LojaValidation.admin, Validation(PedidoValidation.showCarrinhoPedidoAdmin), pedidoController.showCarrinhoPedidoAdmin)

// -- Entrega

// -- Pagamento

// ----------------------------------------------------------------------------------------------

// ----------------------------------------- CLITENTES/VISITANTES -----------------------------------------
// /v1/api/pedidos/ - TESTADO
router.get('/', auth.required, Validation(PedidoValidation.index), pedidoController.index)
// /v1/api/pedidos/:id - TESTADO
router.get("/:id", auth.required, Validation(PedidoValidation.show), pedidoController.show)

// /v1/api/pedidos/ - TESTADO
router.post("/", auth.required, Validation(PedidoValidation.store), pedidoController.store);
// /v1/api/pedidos/:id - TESTADO
router.delete('/:id', auth.required, Validation(PedidoValidation.remove), pedidoController.remove)

// -- Carrinho
// /v1/api/pedidos/admin/:id/carrinho - TESTADO
router.get('/:id/carrinho', auth.required, Validation(PedidoValidation.showCarrinhoPedido), pedidoController.showCarrinhoPedido)

// -- Entrega

// -- Pagamento

// --------------------------------------------------------------------------------------------------------

module.exports = router