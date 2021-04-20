// Descrição: Arquivo responsável por gerenciar todas as rotas da v1

const router = require('express').Router()
const usuarioRoutes = require('./usuarios')
const lojaRoutes = require('./lojas')
const clienteRoutes = require('./clientes')
const categoriasRoutes = require('./categorias')
const produtosRoutes = require('./produtos')
const avaliacoesRoutes = require('./avaliacoes')
const variacoesRoutes = require('./variacoes')
const PedidosRoutes = require('./pedidos')
const EntregasRoutes = require('./entregas')
// const PagamentosRoutes = require('./pagamentos')

router.use('/usuarios', usuarioRoutes)
router.use('/lojas', lojaRoutes)
router.use('/clientes', clienteRoutes)
router.use('/categorias', categoriasRoutes)
router.use('/produtos', produtosRoutes)
router.use('/avaliacoes', avaliacoesRoutes)
router.use('/variacoes', variacoesRoutes)
router.use('/pedidos', PedidosRoutes)
router.use('/entregas', EntregasRoutes)
// router.use('/pagamentos', PagamentosRoutes)

module.exports = router