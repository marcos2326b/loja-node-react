// Descrição: Arquivo responsável pela lógica das rotas das avaliacoes

const mongoose = require('mongoose')
const Avaliacao = mongoose.model('Avaliacao')
const Produto = mongoose.model('Produto')

class AvaliacaoController {
  // ----------------------------------------------------- CLITENTES/VISITANTES  ----------------------------------------------------
  // GET /
  async index(req, res, next) {
    // Pegamos os dados na query
    const { loja, produto } = req.query
    try {
      // Fazemos a busca dos dados
      const avaliacoes = await Avaliacao.find({ loja, produto })
      // Retornamos os dados
      return res.send({ avaliacoes })
    } catch (e) {
      next(e)
    }
  }

  // GET /:id
  async show(req, res, next) {
    // Pegamos os dados na query
    const { loja, produto } = req.query
    // Pegamos o id
    const { id: _id } = req.params
    try {
      // Fazemos a busca dos dados
      const avaliacao = await Avaliacao.findOne({ _id, loja, produto })
      // Retornamos os dados
      return res.send({ avaliacao })
    } catch (e) {
      next(e)
    }
  }

  // POST /
  async store(req, res, next) {
    // Pegamos os dados no body
    const { nome, texto, pontuacao } = req.body
    // Pegamos os dados na query
    const { loja, produto } = req.query
    try {
      // Fazemos a busca dos dados
      const avaliacao = await Avaliacao({ nome, texto, pontuacao, loja, produto })
      // Buscamos o produto que será adicionada a avaliacao
      const _produto = await Produto.findById(produto)
      // Verificação do produto
      if (!_produto) return res.status(422).send({ error: 'Produto não existe!!' })
      // Adicionamos a avaliação no array de avaliacoes do produto
      _produto.avaliacoes.push(avaliacao._id)
      // Salvamos os dados
      await _produto.save()
      await avaliacao.save()
      // Retornamos os dados da avaliacao
      return res.send({ avaliacao })
    } catch (e) {
      next(e)
    }
  }

  // --------------------------------------------------------------------------------------------------------------------------------

  // ----------------------------------------------------- ADMIN ------------------------------------------------------
  // DELETE /:id
  async remove(req, res, next) {
    try {
      // Buscamos a avaliacao
      const avaliacao = await Avaliacao.findById(req.params.id);
      // Buscamos o produto que da avaliacao
      const produto = await Produto.findById(avaliacao.produto);
      // Removemos a avaliação do array de avaliacoes do produto
      produto.avaliacoes = produto.avaliacoes.filter(item => item.toString() !== avaliacao._id.toString());
      // Salvamos o produto
      await produto.save()
      // Removemos a avaliacao
      await avaliacao.remove()
      // Retornamos que foi deletado
      return res.send({ deletado: true })
    } catch (e) {
      next(e)
    }
  }
  // ------------------------------------------------------------------------------------------------------------------
}
module.exports = AvaliacaoController