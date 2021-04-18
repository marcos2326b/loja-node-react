// Descrição: Arquivo responsável pela lógica das rotas do produto

const mongoose = require('mongoose')

const Produto = mongoose.model('Produto')
const Categoria = mongoose.model('Categoria')
const Avaliacao = mongoose.model('Avaliacao')

const getSort = (sortType) => {
  switch (sortType) {
    case 'alfabetica_a-z':
      return { titulo: 1 }
    case 'alfabetica_z-a':
      return { titulo: -1 }
    case 'preco-crescente':
      return { preco: 1 }
    case 'preco-decrescente':
      return { preco: -1 }
    default:
      return {}
  }
}

class ProdutoController {
  // ------------------------------------------------------------ ADMIN -------------------------------------------------------------
  // POST /
  async store(req, res, next) {
    // Desconstrução de objeto - pega os dados no body
    const { titulo, descricao, categoria: categoriaId, preco, promocao, sku } = req.body
    // Pega a loja na query
    const { loja } = req.query

    try {
      // Contrução de objeto
      const produto = new Produto({ titulo, disponibilidade: true, descricao, categoria: categoriaId, preco, promocao, sku, loja })

      // Busca a categoria pelo id
      const categoria = await Categoria.findById(categoriaId)
      // Adiciona o produto no array de produtos da categoria
      categoria.produtos.push(produto._id)

      // Salva o novo produto
      await produto.save()
      // Salva a atualização na categoria
      await categoria.save()

      // Retorna os dados do produto
      return res.send({ produto })
    } catch (e) {
      next(e)
    }
  }

  // PUT /:id  
  async update(req, res, next) {
    // Desconstrução de objeto - pega os dados no body
    const { titulo, descricao, disponibilidade, categoria, preco, promocao, sku } = req.body
    // Pega a loja na query
    const { loja } = req.query

    try {
      // Pega o id do produto
      const produto = await Produto.findById(req.params.id)

      // Verifica se o produto existe
      if (!produto) res.status(400).send({ error: 'Produto não encontrado!!' })

      // Atualiza os dados
      if (titulo) produto.titulo = titulo
      if (descricao) produto.descricao = descricao
      if (disponibilidade !== undefined) produto.disponibilidade = disponibilidade
      if (preco) produto.preco = preco
      if (promocao) produto.promocao = promocao
      if (sku) produto.sku = sku

      // Verifica se existe categoria se existe ela tem que ser da categoria diferente da atual do produto
      if (categoria && categoria.toString() !== produto.categoria.toString()) {
        // Armazena a categoria antiga
        const oldCategoria = await Categoria.findById(produto.categoria)
        // Pega o id da nova categoria
        const newCategoria = await Categoria.findById(categoria)

        if (oldCategoria && newCategoria) {
          // Remove o produto da categoria antiga
          oldCategoria.produtos = oldCategoria.produtos.filter(item => item !== produto._id)
          // Adiciona o produto no array de produtos da categoria
          newCategoria.produtos.push(produto._id)
          // Adiciona a categoria no produto
          produto.categoria = categoria
          // Salva a atualização nas categorias
          await oldCategoria.save()
          await newCategoria.save()
        } else if (newCategoria) {
          // Adiciona o produto no array de produtos da categoria
          newCategoria.produtos.push(produto._id)
          // Adiciona a categoria no produto
          produto.categoria = categoria
          // Salva a atualização na categoria
          await newCategoria.save()
        }
      }
      // Salva o produto
      await produto.save()
      // Retorna os dados do produto
      return res.send({ produto })
    } catch (e) {
      next(e)
    }
  }

  // PUT /images/:id
  async updateImages(req, res, next) {
    try {
      // Pega a loja na query
        const { loja } = req.query

      // pega o id do produto
        const produto = await Produto.findOne({ _id: req.params.id, loja })
      // Verifica se o produto existe
        if(!produto) return res.status(400).send({ error: "Produto não encontrado." })

      // Pega imagem com o nome
        const novasImagens = req.files.map(item => item.filename)
      // Concatena as imagens no array de fotos do produto 
        produto.fotos = produto.fotos.filter(item => item).concat(novasImagens)

      // Salva o produto
        await produto.save()
      // Retorna os dados do produto
        return res.send({ produto })
    } catch (e) {
      next(e)
    }
  }

  // DELETE /:id
  async remove(req, res, next) {
    // Pega a loja na query
    const { loja } = req.query
    try {
      // pega o id do produto
      const produto = await Produto.findOne({ _id: req.params.id, loja })
      // Verifica se o produto existe
      if (!produto) res.status(400).send({ error: 'Produto não encontrado!!' })

      // Pega o id da categoria
      const categoria = await Categoria.findById(produto.categoria)

      if (categoria) {
        // Remove o produto do array de produtos da categoria 
        categoria.produtos = categoria.produtos.filter(item => item !== produto._id)
        // Salva a atualização na categoria
        await categoria.save()
      }

      // Salva o produto
      await produto.remove()
      // Retorna os dados do produto
      return res.send({ deletado: true })
    } catch (e) {
      next(e)
    }
  }
  // --------------------------------------------------------------------------------------------------------------------------------

  // ----------------------------------------------------------- CLIENTES/VISITANTES -----------------------------------------------------------
  // GET /
  async index(req, res, next) {
    // Pega os dados
    const offset = Number(req.query.offset) || 0
    const limit = Number(req.query.limit) || 30
    try {
      // Armazena os dados do produto
      const produtos = await Produto.paginate(
        { loja: req.query.loja },
        { offset, limit, sort: getSort(req.query.sortType) }
      )
      // Retorna os dados dos produtos
      return res.send({ produtos })
    } catch (e) {
      next(e)
    }
  }

  // GET /disponiveis
  async indexDisponiveis(req, res, next) {
    // Pega os dados
    const offset = Number(req.query.offset) || 0
    const limit = Number(req.query.limit) || 30
    try {
      // Armazena os dados do produto
      const produtos = await Produto.paginate(
        // Retorna apenas o que é true
        { loja: req.query.loja, disponibilidade: true },
        { offset, limit, sort: getSort(req.query.sortType) }
      )
      // Retorna os dados dos produtos
      return res.send({ produtos })
    } catch (e) {
      next(e)
    }
  }

  // GET /search/:search
  async search(req, res, next) {
    // Pega os dados
    const offset = Number(req.query.offset) || 0
    const limit = Number(req.query.limit) || 30
    const search = new RegExp(req.params.search, 'i')
    try {
      // Armazena os dados do produto
      const produtos = await Produto.paginate(
        // Retorna apenas o que é true
        {
          loja: req.query.loja,
          $or: [
            { 'titulo': { $regex: search } },
            { 'descricao': { $regex: search } },
            { 'sku': { $regex: search } },
          ]
        },
        { offset, limit, sort: getSort(req.query.sortType) }
      )
      // Retorna os dados dos produtos
      return res.send({ produtos })
    } catch (e) {
      next(e)
    }
  }

  // GET /:id
  async show(req, res, next) {
    try {
      // Pega o produto
      const produto = await Produto
        .findById(req.params.id)
        .populate(['avaliacoes', 'variacoes', 'loja'])

      // Retorna os dados dos produtos
      return res.send({ produto })
    } catch (e) {
      next(e)
    }
  }
  // -------------------------------------------------------------------------------------------------------------------------------------------

  // ----------------------------------------------------------- AVALIAÇÕES -----------------------------------------------------------
  // GET /:id/avaliacoes
  async showAvaliacoes(req, res, next) {
    try {
      // Pega todas as avaliações que tiverem o id igual ao produto passado no params serão retornadas
      const avaliacoes = await Avaliacao.find({ produto: req.params.id })
      // Retorna os dados das avaliações
      return res.send({ avaliacoes })
    } catch (e) {
      next(e)
    }
  }
  // ----------------------------------------------------------------------------------------------------------------------------------
}

module.exports = ProdutoController