// Descrição: Arquivo responsável pela lógica das rotas das categorias

const mongoose = require('mongoose')
const Categoria = mongoose.model('Categoria')

class CategoriaController {
  // ----------------------------------------------------- LISTAGEM DE DADOS -----------------------------------------------------
  // GET /
  index(req, res, next) {
    // Busca os dados das categorias
    Categoria.find({ loja: req.query.loja })
      .select("_id produtos nome codigo disponibilidade loja")
      // Envia os dados
      .then((categorias) => res.send({ categorias }))
      .catch(next);
  }

  // GET /disponiveis/
  indexDisponiveis(req, res, next) {
    // Busca os dados das categorias e retorna as disponiveis
    Categoria.find({ loja: req.query.loja, disponibilidade: true })
      .select("_id produtos nome codigo disponibilidade loja")
      // Envia os dados
      .then(categorias => res.send({ categorias }))
      .catch(next)
  }

  // GET /:id
  show(req, res, next) {
    // Busca os dados da loja por id
    Categoria.findOne({ loja: req.query.loja, _id: req.params.id })
      .select("_id produtos nome codigo disponibilidade loja")
      .populate(["produtos"])
      // Envia os dados
      .then(categoria => res.send({ categoria }))
      .catch(next)
  }
  // --------------------------------------------------------------------------------------------------------------------------------

  // ----------------------------------------------------- AÇÕES DA lOJA -----------------------------------------------------
  // POST /
  store(req, res, next) {
    // Pega os dados no body
    const { nome, codigo } = req.body
    const { loja } = req.query
    // Cria uma nova categoria
    const categoria = new Categoria({ nome, codigo, loja, disponibilidade: true })
    // Salva a nova categoria e envia os dados
    categoria.save()
      .then(() => res.send({ categoria }))
      .catch(next)
  }
  // PUT /:id
  async update(req, res, next) {
    // Pega os dados no body
    const { nome, codigo, disponibilidade, produtos } = req.body

    try {
      // Pega o id da categoria
      const categoria = await Categoria.findById(req.params.id)

      if (nome) categoria.nome = nome
      if (codigo) categoria.codigo = codigo
      if (disponibilidade != undefined) categoria.disponibilidade = disponibilidade
      if (produtos) categoria.produtos = produtos

      // Salva os novos dados da categoria e retorna
      await categoria.save()
      return res.send({ categoria })
    } catch (e) {
      next(e)
    }
  }

  // DELETE /:id
  async remove(req, res, next) {
    try {
      // Pega o id da categoria
      const categoria = await Categoria.findById(req.params.id)
      // Remove a categoria e true
      await categoria.remove()
      return res.send({ deletado: true })
    } catch (e) {
      next(e)
    }
  }
  // --------------------------------------------------------------------------------------------------------------------------------

  // ----------------------------------------------------- PRODUTOS -----------------------------------------------------
  // --------------------------------------------------------------------------------------------------------------------------------
}
module.exports = CategoriaController