// Descrição: Arquivo responsável por gerenciar todas as rotas da v1

const router = require('express').Router()
const usuarioRoutes = require('./usuarios')
const lojaRoutes = require('./lojas')

router.use('/usuarios', usuarioRoutes)
router.use('/lojas', lojaRoutes)

module.exports = router