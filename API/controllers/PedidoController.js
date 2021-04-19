// Descrição: Arquivo responsável pela lógica das rotas dos pedidos

const mongoose = require('mongoose')

const Pedido = mongoose.model('Pedido')
const Produto = mongoose.model('Produto')
const Variacao = mongoose.model('Variacao')
const Pagamento = mongoose.model('Pagamento')
const Entrega = mongoose.model('Entrega')
const Cliente = mongoose.model('Cliente')

const CarrinhoValidation = require('./validations/carrinhoValidation')
// const EntregaValidation = require('./validations/entregaValidation')
// const PagamentoValidation = require('./validations/pagamentoValidation')

class PedidoController {
  // ------------------------------------------------------------ ADMIN -------------------------------------------------------------
  // GET /admin - indexAdmin
  async indexAdmin(req, res, next) {
    // Pega os dados
    const { offset, limit, loja } = req.query
    try {
      // Armazena os dados do pedido
      const pedidos = await Pedido.paginate(
        { loja },
        {
          offset: Number(offset || 0),
          limit: Number(limit || 30),
          populate: ["cliente", "pagamento", "entrega"]
        }
      );
      // Busca no docs
      pedidos.docs = await Promise.all(pedidos.docs.map(async (pedido) => {
        // Adiciona no carrinho
        pedido.carrinho = await Promise.all(pedido.carrinho.map(async (item) => {
          // Adicona o produto e variação
          item.produto = await Produto.findById(item.produto);
          item.variacao = await Variacao.findById(item.variacao);
          // Retorna o item do carrinho
          return item
        }))
        // Retorna o pedido
        return pedido
      }))
      // Retorna os dados dos pedidos
      return res.send({ pedidos })
    } catch (e) {
      next(e)
    }
  }

  // GET /admin/:id - showAdmin
  async showAdmin(req, res, next) {
    try {
      const pedido = await Pedido.findOne({ loja: req.query.loja, _id: req.params.id })
        .populate(['cliente', 'pagamento', 'entrega'])

      pedido.carrinho = pedido.carrinho = await Promise.all(pedido.carrinho.map(async (item) => {
        // Adicona o produto e variação
        item.produto = await Produto.findById(item.produto)
        item.variacao = await Variacao.findById(item.variacao)
        // Retorna o item do carrinho
        return item
      }))
      // Retorna os dados do pedido
      return res.send({ pedido })
    } catch (e) {
      next(e)
    }
  }

  // DELETE /admin/:id - removeAdmin
  async removeAdmin(req, res, next) {
    try {
      const pedido = await Pedido.findOne({ loja: req.query.loja, _id: req.params.id })

      if (!pedido) res.status(400).send('Pedido não encontrado!!')
      pedido.cancelado = true

      // Registro de atividades = pedido cancelado
      // Enviar Email para cliente = pedido cancelado

      // Salva a alteração no pedido
      await pedido.save()

      // Retorna os dados do pedido
      return res.send({ cancelado: true })
    } catch (e) {
      next(e)
    }
  }

  // GET /admin/:id/carrinho - showCarrinhoPedidoAdmin
  async showCarrinhoPedidoAdmin(req, res, next) {
    try {
      const pedido = await Pedido.findOne({ loja: req.query.loja, _id: req.params.id })

      pedido.carrinho = pedido.carrinho = await Promise.all(pedido.carrinho.map(async (item) => {
        // Adicona o produto e variação
        item.produto = await Produto.findById(item.produto)
        item.variacao = await Variacao.findById(item.variacao)
        // Retorna o item do carrinho
        return item
      }))
      // Retorna os dados do pedido
      return res.send({ carrinho: pedido.carrinho })
    } catch (e) {
      next(e)
    }
  }
  // --------------------------------------------------------------------------------------------------------------------------------

  // ----------------------------------------------------------- CLIENTES -----------------------------------------------------------
  // GET / - index
  async index(req, res, next) {
    const { offset, limit, loja } = req.query;
    try {
      const cliente = await Cliente.findOne({ usuario: req.payload.id });
      const pedidos = await Pedido.paginate(
        { loja, cliente: cliente._id },
        {
          offset: Number(offset || 0),
          limit: Number(limit || 30),
          populate: ["cliente", "pagamento", "entrega"]
        }
      );
      pedidos.docs = await Promise.all(pedidos.docs.map(async (pedido) => {
        pedido.carrinho = await Promise.all(pedido.carrinho.map(async (item) => {
          item.produto = await Produto.findById(item.produto);
          item.variacao = await Variacao.findById(item.variacao);
          return item;
        }));
        return pedido;
      }));
      return res.send({ pedidos });
    } catch (e) {
      next(e);
    }
  }

  // GET /:id - show
  async show(req, res, next) {
    try {
      const cliente = await Cliente.findOne({ usuario: req.payload.id });
      const pedido = await Pedido
        .findOne({ cliente: cliente._id, _id: req.params.id })
        .populate(["cliente", "pagamento", "entrega", "loja"]);
      pedido.carrinho = await Promise.all(pedido.carrinho.map(async (item) => {
        item.produto = await Produto.findById(item.produto);
        item.variacao = await Variacao.findById(item.variacao);
        return item;
      }));
      return res.send({ pedido });
    } catch (e) {
      next(e);
    }
  }

  // POST / - store
  async store(req, res, next) {
    const { carrinho, pagamento, entrega } = req.body
    const { loja } = req.query
    try {
      // Checar os dados do carrinho
      if (!await CarrinhoValidation(carrinho)) return res.status(422).send({ error: "Carrinho Inválido" });
      // Checar os dados da entrega
      // if (!EntregaValidation(carrinho, entrega)) return res.status(422).send({ error: 'Dados de entrega inválidos!!' })
      // Checar os dados do pagamento
      // if (!PagamentoValidation(carrinho, pagamento)) return res.status(422).send({ error: 'Dados de pagamento inválidos!!' })

      const cliente = await Cliente.findOne({ usuario: req.payload.id })

      const novoPagamento = new Pagamento({
        valor: pagamento.valor,
        forma: pagamento.forma,
        status: 'Iniciando',
        payload: pagamento,
        loja
      })
      const novaEntrega = new Entrega({
        status: "nao_iniciado",
        custo: entrega.custo,
        prazo: entrega.prazo,
        tipo: entrega.tipo,
        payload: entrega,
        loja
      })

      const pedido = new Pedido({
        cliente: cliente._id,
        carrinho,
        pagamento: novoPagamento._id,
        entrega: novaEntrega._id,
        loja
      })

      novoPagamento.pedido = pedido._id
      novaEntrega.pedido = pedido._id

      await pedido.save()
      console.log("e");
      await novoPagamento.save()
      await novaEntrega.save()

      // Notificar via email - cliente e admin = novo pedido

      return res.send({ pedido: Object.assign({}, pedido._doc, { entrega: novaEntrega, pagamento: novoPagamento, cliente }) })
    } catch (e) {
      next(e)
    }
  }

  // DELETE /:id - remove
  async remove(req, res, next) {
    try {
      const cliente = await Cliente.findOne({ usuario: req.payload.id })
      if (!cliente) res.status(400).send('Cliente não encontrado!!')

      const pedido = await Pedido.findOne({ cliente: cliente._id, _id: req.params.id })

      if (!pedido) res.status(400).send('Pedido não encontrado!!')
      pedido.cancelado = true

      // Registro de atividades = pedido cancelado
      // Enviar Email para admin = pedido cancelado

      // Salva a alteração no pedido
      await pedido.save()

      // Retorna os dados do pedido
      return res.send({ cancelado: true })
    } catch (e) {
      next(e)
    }
  }

  // GET /:id/carrinho - showCarrinhoPedido
  async showCarrinhoPedido(req, res, next) {
    try {
      const cliente = await Cliente.findOne({ usuario: req.payload.id })
      const pedido = await Pedido.findOne({ cliente: cliente._id, _id: req.params.id })

      pedido.carrinho = pedido.carrinho = await Promise.all(pedido.carrinho.map(async (item) => {
        // Adicona o produto e variação
        item.produto = await Produto.findById(item.produto)
        item.variacao = await Variacao.findById(item.variacao)
        // Retorna o item do carrinho
        return item
      }))
      // Retorna os dados do pedido
      return res.send({ carrinho: pedido.carrinho })
    } catch (e) {
      next(e)
    }
  }
  // -------------------------------------------------------------------------------------------------------------------------------

}

module.exports = PedidoController