// Descrição: Arquivo responsável por todas as rotas dos clientes

const router = require('express').Router()
const auth = require('../../auth')
const Validation = require('express-validation')

const ClienteController = require('../../../controllers/ClienteController')
const clienteController = new ClienteController()

const { LojaValidation } = require('../../../controllers/validations/lojaValidation')
const { ClienteValidation } = require('../../../controllers/validations/clienteValidation')

// ----------------------------------------- ADMIN -----------------------------------------
// /v1/api/clientes/ - TESTADO
router.get('/', auth.required, LojaValidation.admin, Validation(ClienteValidation.index), clienteController.index)
// /v1/api/clientes/search/:search/pedidos - VER TODOS OS PEDIDOS - TESTADO
router.get('/search/:search/pedidos', auth.required, LojaValidation.admin, Validation(ClienteValidation.searchPedidos), clienteController.searchPedidos)
// /v1/api/clientes/search/:search - VER OS CLIENTES
router.get("/search/:search", auth.required, LojaValidation.admin, Validation(ClienteValidation.search), clienteController.search)

// /v1/api/clientes/admin/:id - VER DADOS DO USUARIO - TESTADO
router.get('/admin/:id', auth.required, LojaValidation.admin, Validation(ClienteValidation.showAdmin), clienteController.showAdmin)
// /v1/api/clientes/admin/:id/pedidos - VER TODOS OS PEDIDOS DE UM CLIENTE - TESTADO
router.get('/admin/:id/pedidos', auth.required, LojaValidation.admin, Validation(ClienteValidation.showPedidosCliente), clienteController.showPedidosCliente)

// /v1/api/clientes/admin/:id - ATUALIZAR DADOS DO CLIENTE PELO ADMIN - TESTADO
router.put('/admin/:id', auth.required, LojaValidation.admin, Validation(ClienteValidation.updateAdmin), clienteController.updateAdmin)
// ------------------------------------------------------------------------------------------

// ----------------------------------------- CLIENTE -----------------------------------------
// /v1/api/clientes/:id - CLIENTE VER OS DADOS DELE - TESTADO
router.get('/:id', auth.required, Validation(ClienteValidation.show), clienteController.show)
// /v1/api/clientes/ - CRIAR CLIENTE - TESTADO
router.post('/', Validation(ClienteValidation.store), clienteController.store)
// /v1/api/clientes/:id - ATUALIZAR DADOS DO CLIENTE - TESTADO
router.put('/:id', auth.required, Validation(ClienteValidation.update), clienteController.update)
// /v1/api/clientes/:id - TESTADO
router.delete('/:id', auth.required, clienteController.remove)
// -------------------------------------------------------------------------------------------

module.exports = router