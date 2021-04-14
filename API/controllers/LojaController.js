// Descrição: Arquivo responsável pela lógica das rotas da loja

const mongoose = require('mongoose')
const Loja = mongoose.model('Loja')

class LojaController {
  // ----------------------------------------------------- LISTAGEM DE DADOS -----------------------------------------------------
  // GET /
  index(req, res, next) {
    // Busca os dados das lojas
    Loja.find({}).select('_id nome cnpj email telefones endereco')
      // Envia os dados
      .then(lojas => res.send({ lojas }))
      .catch(next)
  }
  // GET /:id
  show(req, res, next) {
    // Busca os dados da loja por id
    Loja.findById(req.params.id).select('_id nome cnpj email telefones endereco')
      // Envia os dados
      .then(loja => res.send({ loja }))
      .catch(next)
  }
  // --------------------------------------------------------------------------------------------------------------------------------

  // ----------------------------------------------------- AÇÕES DA lOJA -----------------------------------------------------
  // POST /
  store(req, res, next) {
    // Pega os dados no body
    const { nome, cnpj, email, telefones, endereco } = req.body

    // Verifica se os campos estão preenchidos
    // const error = []
    // if(!nome) error.push('nome')
    // if(!cnpj) error.push('cnpj')
    // if(!email) error.push('email')
    // if(!telefones) error.push('telefones')
    // if(!endereco) error.push('endereco')
    // if(error.length > 0) return res.status(422).json({ error: 'required', payload: error })

    // Cria uma nova loja
    const loja = new Loja({ nome, cnpj, email, telefones, endereco })
    // Salva a nova loja e envia os dados
    loja.save()
      .then(() => res.send({ loja }))
      .catch(next)
  }
  // PUT /:id
  update(req, res, next) {
    // Pega os dados no body
    const { nome, cnpj, email, telefones, endereco } = req.body

    // Busca a loja por id
    Loja.findById(req.query.loja)
      .then(loja => {
        // Verifica se a loja existe
        if (!loja) return res.status(422).send({ error: 'Loja não existe.' })
        if (nome) loja.nome = nome
        if (cnpj) loja.cnpj = cnpj
        if (email) loja.email = email
        if (telefones) loja.telefones = telefones
        if (endereco) loja.endereco = endereco

        // Salva os novos dados da loja e envia os dados
        loja.save()
          .then(() => res.send({ loja }))
          .catch(next)

      }).catch(next)
  }
  // DELETE /:id
  remove(req, res, next) {
    // Busca a loja por id
    Loja.findById(req.query.loja)
      .then(loja => {
        // Verifica se a loja existe
        if (!loja) return res.status(422).send({ error: 'Loja não existe.' })
        // Deleta a loja e envia os dados
        loja.remove()
          .then(() => res.send({ deleted: true }))
          .catch(next)
      }).catch(next)
  }
  // --------------------------------------------------------------------------------------------------------------------------------
}

module.exports = LojaController