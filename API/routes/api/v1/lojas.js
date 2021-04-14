// Descrição: Arquivo responsável por todas as rotas das lojas

const router = require('express').Router()
const auth = require('../../auth')

const LojaController = require('../../../controllers/LojaController')
const lojaController = new LojaController()

const Validation = require('express-validation')
const { LojaValidation } = require('../../../controllers/validations/lojaValidation')

// /v1/api/lojas/ - TESTADO
router.get('/', lojaController.index)
// /v1/api/lojas/:id - TESTADO
router.get('/:id', Validation(LojaValidation.show), lojaController.show)

// /v1/api/lojas/ - TESTADO
router.post('/', auth.required, Validation(LojaValidation.store), lojaController.store)
// /v1/api/lojas/:id - TESTADO
router.put('/:id', auth.required, LojaValidation.admin, Validation(LojaValidation.update), lojaController.update)
// /v1/api/lojas/:id - TESTADO
router.delete('/:id', auth.required, LojaValidation.admin, lojaController.remove)

module.exports = router