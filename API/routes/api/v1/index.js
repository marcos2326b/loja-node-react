// Descrição: Arquivo responsável por gerenciar todas as rotas da v1

const router = require('express').Router()
const usuarioRoutes = require('./usuarios')
const lojaRoutes = require('./lojas')
const clienteRoutes = require('./clientes')
const categoriasRoutes = require('./categorias')
const produtosRoutes = require('./produtos')

router.use('/usuarios', usuarioRoutes)
router.use('/lojas', lojaRoutes)
router.use('/clientes', clienteRoutes)
router.use('/categorias', categoriasRoutes)
router.use('/produtos', produtosRoutes)

module.exports = router