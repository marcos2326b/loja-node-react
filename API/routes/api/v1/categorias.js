// Descrição: Arquivo responsável por todas as rotas das categorias

const router = require('express').Router()
const auth = require('../../auth')
const Validation = require('express-validation')

const CategoriaController = require('../../../controllers/CategoriaController')
const categoriaController = new CategoriaController()

const { LojaValidation } = require('../../../controllers/validations/lojaValidation')
const { CategoriaValidation } = require('../../../controllers/validations/categoriaValidation')


// /v1/api/categorias/ - TESTADO
router.get('/', Validation(CategoriaValidation.index), categoriaController.index)
// /v1/api/categorias/disponiveis/ - TESTADO
router.get("/disponiveis/", Validation(CategoriaValidation.indexDisponiveis), categoriaController.indexDisponiveis)
// /v1/api/categorias/:id  - TESTADO
router.get('/:id', Validation(CategoriaValidation.show), categoriaController.show)

// /v1/api/categorias/ - TESTADO
router.post('/', auth.required, LojaValidation.admin, Validation(CategoriaValidation.store), categoriaController.store)
// /v1/api/categorias/:id - TESTADO
router.put('/:id', auth.required, LojaValidation.admin, Validation(CategoriaValidation.update), categoriaController.update)
// /v1/api/categorias/:id - TESTADO
router.delete('/:id', auth.required, LojaValidation.admin, Validation(CategoriaValidation.remove), categoriaController.remove)

// ROTAS DO PRODUTO

module.exports = router