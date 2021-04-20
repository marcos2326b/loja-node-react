// Descrição: Arquivo responsável por todas as rotas das entregas

const router = require('express').Router()
const auth = require('../../auth')
const Validation = require('express-validation')

const EntregaController = require('../../../controllers/EntregaController')
const entregaController = new EntregaController()

const { LojaValidation } = require('../../../controllers/validations/lojaValidation')
const { EntregaValidation } = require('../../../controllers/validations/entregaValidation')

// -------------------------------------------------------------------------------------------
// /v1/api/entregas/:id - TESTADO
router.get('/:id', auth.required, Validation(EntregaValidation.show), entregaController.show)
// /v1/api/entregas/:id - TESTADO
router.put('/:id', auth.required, LojaValidation.admin, Validation(EntregaValidation.update), entregaController.update)
// /v1/api/entregas/calcular - TESTADO
router.post('/calcular', auth.required, Validation(EntregaValidation.calcular), entregaController.calcular)
// -------------------------------------------------------------------------------------------

module.exports = router