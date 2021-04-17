// Descrição: Arquivo responsável por todas as rotas dos produtos

const router = require('express').Router()
const auth = require('../../auth')
const Validation = require('express-validation')
const upload = require('../../../config/multer')

const ProdutoController = require('../../../controllers/ProdutoController')
const produtoController = new ProdutoController()

const { LojaValidation } = require('../../../controllers/validations/lojaValidation')
const { ProdutoValidation } = require('../../../controllers/validations/produtoValidation')

// ----------------------------------------- ADMIN ------------------------------------------
// /v1/api/produtos/ - TESTADO
router.post('/', auth.required, LojaValidation.admin, Validation(ProdutoValidation.store), produtoController.store)
// /v1/api/produtos/:id - TESTADO
router.put('/:id', auth.required, LojaValidation.admin, Validation(ProdutoValidation.update), produtoController.update)
// /v1/api/produtos/images/:id - TESTADO
router.put('/images/:id', auth.required, LojaValidation.admin, Validation(ProdutoValidation.updateImages), upload.array('files', 4), produtoController.updateImages)
// /v1/api/produtos/:id - TESTADO
router.delete('/:id', auth.required, LojaValidation.admin, Validation(ProdutoValidation.remove), produtoController.remove)
// -------------------------------------------------------------------------------------------

// ----------------------------------------- CLIENTES/VISITANTES -----------------------------------------
// /v1/api/produtos/ - TESTADO
router.get('/', Validation(ProdutoValidation.index), produtoController.index)
// /v1/api/produtos/:id - TESTADO
router.get('/disponiveis', Validation(ProdutoValidation.indexDisponiveis), produtoController.indexDisponiveis)
// /v1/api/produtos/search/:search - TESTADO
router.get('/search/:search', Validation(ProdutoValidation.search), produtoController.search)
// /v1/api/produtos/:id - TESTADO
router.get('/:id', Validation(ProdutoValidation.show), produtoController.show)
// ------------------------------------------------------------------------------------------------------

// ----------------------------------------- VARIAÇÕES -----------------------------------------

// ---------------------------------------------------------------------------------------------

// ----------------------------------------- AVALIAÇÕES -----------------------------------------

// ----------------------------------------------------------------------------------------------
module.exports = router