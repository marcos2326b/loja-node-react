// Descrição: Arquivo responsável por todas as rotas das variacoes

const router = require('express').Router()
const auth = require('../../auth')
const Validation = require('express-validation')
const upload = require('../../../config/multer')

const VariacaoController = require('../../../controllers/VariacaoController')
const variacaoController = new VariacaoController()

const { LojaValidation } = require('../../../controllers/validations/lojaValidation')
const { VariacaoValidation } = require('../../../controllers/validations/variacaoValidation')

// ----------------------------------------- CLITENTES/VISITANTES -----------------------------------------
// /v1/api/variacoes/ - TESTADO
router.get('/', Validation(VariacaoValidation.index), variacaoController.index)
// /v1/api/clientes/variacoes/:id - TESTADO
router.get("/:id", Validation(VariacaoValidation.show), variacaoController.show)
// ---------------------------------------------------------------------------------------------------------

// ----------------------------------------- ADMIN -------------------------------------------
// /v1/api/variacoes/ - TESTADO
router.post('/', auth.required, LojaValidation.admin, Validation(VariacaoValidation.store), variacaoController.store)
// /v1/api/variacoes/:id - TESTADO
router.put('/:id', auth.required, LojaValidation.admin, Validation(VariacaoValidation.update), variacaoController.update)
// /v1/api/variacoes/images/:id - TESTADO
router.put('/images/:id', auth.required, LojaValidation.admin, Validation(VariacaoValidation.updateImages), upload.array('files', 4), variacaoController.updateImages)
// /v1/api/avaliacoes/:id - TESTADO
router.delete('/:id', auth.required, LojaValidation.admin, Validation(VariacaoValidation.remove), variacaoController.remove)
// -------------------------------------------------------------------------------------------

module.exports = router