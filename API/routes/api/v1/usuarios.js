// Descrição: Arquivo responsável por todas as rotas dos usuarios

const router = require('express').Router()
const auth = require('../../auth')

const UsuarioController = require('../../../controllers/UsuarioController')
const usuarioController = new UsuarioController()

const Validation = require('express-validation')
const { UsuarioValidation } = require('../../../controllers/validations/usuarioValidation')

// /v1/api/usuarios/login - TESTADO
router.post('/login', Validation(UsuarioValidation.login), usuarioController.login)
// /v1/api/usuarios/registrar - TESTADO
router.post('/registrar', Validation(UsuarioValidation.store), usuarioController.store)
// /v1/api/usuarios/ - TESTADO
router.put('/', auth.required, Validation(UsuarioValidation.update), usuarioController.update)
// /v1/api/usuarios/ - TESTADO
router.delete('/', auth.required, usuarioController.remove)

// /v1/api/usuarios/recuperar-senha - TESTADO
router.get('/recuperar-senha', usuarioController.showRecovery)
// /v1/api/usuarios/recuperar-senha - TESTADO
router.post('/recuperar-senha', usuarioController.createRecovery)
// /v1/api/usuarios/senha-recuperada - TESTADO
router.get('/senha-recuperada', usuarioController.showCompleteRecovery)
// /v1/api/usuarios/senha-recuperada - TESTADO
router.post('/senha-recuperada', usuarioController.completeRecovery)

// /v1/api/usuarios/ - TESTADO
router.get('/', auth.required, usuarioController.index)
// /v1/api/usuarios/:id - TESTADO
router.get('/:id', auth.required, Validation(UsuarioValidation.show), usuarioController.show)

module.exports = router