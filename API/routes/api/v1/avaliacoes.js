// Descrição: Arquivo responsável por todas as rotas das avaliacoes

const router = require('express').Router()
const auth = require('../../auth')
const Validation = require('express-validation')

const AvaliacaoController = require('../../../controllers/AvaliacaoController')
const avaliacaoController = new AvaliacaoController()

const { LojaValidation } = require('../../../controllers/validations/lojaValidation')
const { AvaliacaoValidation } = require('../../../controllers/validations/avaliacaoValidation')

// ----------------------------------------- CLITENTES/VISITANTES -----------------------------------------
// /v1/api/avaliacoes/ - TESTADO
router.get('/', Validation(AvaliacaoValidation.index), avaliacaoController.index)
// /v1/api/clientes/avaliacoes/:id - TESTADO
router.get("/:id", Validation(AvaliacaoValidation.show), avaliacaoController.show)
// /v1/api/avaliacoes/ - TESTADO
router.post('/', auth.required, Validation(AvaliacaoValidation.store), avaliacaoController.store)
// ---------------------------------------------------------------------------------------------------------

// ----------------------------------------- ADMIN -------------------------------------------
// /v1/api/avaliacoes/:id - TESTADO
router.delete('/:id', auth.required, LojaValidation.admin, Validation(AvaliacaoValidation.remove), avaliacaoController.remove)
// -------------------------------------------------------------------------------------------

module.exports = router