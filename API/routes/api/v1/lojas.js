// Descrição: Arquivo responsável por todas as rotas das lojas

const router = require('express').Router()
const lojaValidation = require('../../../controllers/validations/lojaValidation')
const auth = require('../../auth')
const LojaController = require('../../../controllers/LojaController')

const lojaController = new LojaController()

// /v1/api/lojas/ - TESTADO
router.get('/', lojaController.index)
// /v1/api/lojas/:id - TESTADO
router.get('/:id', lojaController.show)

// /v1/api/lojas/ - TESTADO
router.post('/', auth.required, lojaController.store)
// /v1/api/lojas/:id - TESTADO
router.put('/:id', auth.required, lojaValidation, lojaController.update)
// /v1/api/lojas/:id - TESTADO
router.delete('/:id', auth.required, lojaValidation, lojaController.remove)

module.exports = router