// Descrição: Arquivo responsável por gerenciar todas as rotas da v1

const router = require('express').Router()
const usuarioRoutes = require('./usuarios')

router.use('/usuarios', usuarioRoutes)

module.exports = router