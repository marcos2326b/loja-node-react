// Descrição: Arquivo responsável pela lógica das rotas do cliente

const mongoose = require('mongoose')
const Cliente = mongoose.model('Cliente')
const Usuario = mongoose.model('Usuario')

class ClienteController {
  // ------------------------------------------------------------ ADMIN -------------------------------------------------------------
  // GET /
  async index(req, res, next) {
    try {
      // offset - Quando tem que pular para mostrar um conteudo da pagina
      const offset = Number(req.query.offset) || 0
      // limit - Quanto quer mostrar na pagina
      const limit = Number(req.query.limit) || 30
      const clientes = await Cliente.paginate(
        { loja: req.query.loja },
        { offset, limit, populate: { path: "usuario", select: "-salt -hash" } }
      );
      return res.send({ clientes })
    } catch (e) {
      next(e)
    }
  }

  // GET /search/:search/pedidos
  searchPedidos(req, res, next) {
    return res.status(400).send({ error: 'Em Desenvolvimento.' })
  }

  // GET /search/:search
  async search(req, res, next) {
    // offset - Quando tem que pular para mostrar um conteudo da pagina
    const offset = Number(req.query.offset) || 0;
    // limit - Quanto quer mostrar na pagina
    const limit = Number(req.query.limit) || 30;
    const search = new RegExp(req.params.search, "i");
    try {
      const clientes = await Cliente.paginate(
        {
          loja: req.query.loja,
          $or: [
            { $text: { $search: search, $diacriticSensitive: false } },
            { telefones: { $regex: search } }
          ]
        },
        { offset, limit, populate: { path: "usuario", select: "-salt -hash" } }
      );
      return res.send({ clientes })
    } catch (e) {
      next(e)
    }
  }

  // GET /admin/:id
  async showAdmin(req, res, next) {
    try {
      // Faz a busca pelo cliente com os dados passados
      const cliente = await Cliente.findOne({ _id: req.params.id, loja: req.query.loja }).populate({ path: "usuario", select: "-salt -hash" })
      return res.send({ cliente })
    } catch (e) {
      next(e)
    }
  }

  // PUT /admin/:id
  async updateAdmin(req, res, next) {
    // Pega os dados no body
    const { nome, cpf, email, telefones, endereco, dataDeNascimento } = req.body;
    try {
      // Faz a busca pelo cliente
      const cliente = await Cliente.findById(req.params.id).populate({ path: "usuario", select: "-salt -hash" })

      // Se valores existirem atualiza valores
      if (nome) {
        cliente.usuario.nome = nome
        cliente.nome = nome
      }
      if (email) cliente.usuario.email = email
      if (cpf) cliente.cpf = cpf
      if (telefones) cliente.telefones = telefones
      if (endereco) cliente.endereco = endereco
      if (dataDeNascimento) cliente.dataDeNascimento = dataDeNascimento

      // Salva os dados
      await cliente.usuario.save()
      await cliente.save()
      return res.send({ cliente })
    } catch (e) {
      next(e)
    }
  }

  // GET /admin/:id/pedidos
  showPedidosCliente(req, res, next) {
    return res.status(400).send({ error: 'Em Desenvolvimento.' })
  }
  // --------------------------------------------------------------------------------------------------------------------------------

  // ----------------------------------------------------------- CLIENTES -----------------------------------------------------------
  // GET /:id
  async show(req, res, next) {
    try {
      const cliente = await Cliente.findOne({ usuario: req.payload.id, loja: req.query.loja }).populate({ path: "usuario", select: "-salt -hash" })
      return res.send({ cliente })
    } catch (e) {
      next(e)
    }
  }

  // POST /
  async store(req, res, next) {
    // Pega os dados no body
    const { nome, cpf, email, telefones, endereco, dataDeNascimento, password } = req.body
    const { loja } = req.query

    // Cria um novo usuario e verifica a senha
    const usuario = new Usuario({ nome, email, loja })
    usuario.setSenha(password)

    // Cria um novo cliente linkando com o novo usuario
    const cliente = new Cliente({ nome, cpf, telefones, endereco, loja, dataDeNascimento, usuario: usuario._id })

    try {
      // Salva os dados
      await usuario.save()
      await cliente.save()
      return res.send({ cliente: Object.assign({}, cliente._doc, { email: usuario.email }) })
    } catch (e) {
      next(e)
    }
  }

  // PUT /:id
  async update(req, res, next) {
    // Pega os dados no body
    const { nome, cpf, email, telefones, endereco, dataDeNascimento, password } = req.body

    try {
      // Faz a busca pelo cliente
      const cliente = await Cliente.findOne({ usuario: req.payload.id }).populate('usuario')

      if (!cliente) return res.send({ error: 'Cliente não existe!!' })

      // Se valores existirem atualiza valores
      if (nome) {
        cliente.usuario.nome = nome
        cliente.nome = nome
      }
      if (email) cliente.usuario.email = email
      if (password) cliente.usuario.password = password
      if (cpf) cliente.cpf = cpf
      if (telefones) cliente.telefones = telefones
      if (endereco) cliente.endereco = endereco
      if (dataDeNascimento) cliente.dataDeNascimento = dataDeNascimento

      // Salva os dados
      await cliente.save()
      cliente.usuario = {
        email: cliente.usuario.email,
        _id: cliente.usuario._id,
        permissao: cliente.usuario.permissao
      }
      return res.send({ cliente })
    } catch (e) {
      next(e)
    }
  }

  // DELETE /:id
  async remove(req, res, next) {
    try {
      const cliente = await Cliente.findOne({ usuario: req.payload.id }).populate("usuario")
      // Remove a opção de login
      await cliente.usuario.remove()
      // Muda para deletado o status, mas o dono da loja ainda consegue ver o registro do cliente
      cliente.deletado = true
      // Salva os dados
      await cliente.save()
      return res.send({ deletado: true })
    } catch (e) {
      next(e)
    }
  }
  // --------------------------------------------------------------------------------------------------------------------------------
}

module.exports = ClienteController