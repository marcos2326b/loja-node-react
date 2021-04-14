// Descrição: Arquivo responsável por fazer a validação de acesso do usuario a loja 

const mongoose = require('mongoose')
const Usuario = mongoose.model('Usuario')
const Loja = mongoose.model('Loja')

const BaseJoi = require("joi")
const Extension = require("joi-date-extensions")
const Joi = BaseJoi.extend(Extension)

const LojaValidation = {
  admin: (req, res, next) => {
    // Se não for passado um id = Acesso não autorizado
    if (!req.payload.id) return res.sendStatus(401)
    const { loja } = req.query
    // Se não for passada uma loja = Acesso não autorizado
    if (!loja) return res.sendStatus(401)

    Usuario.findById(req.payload.id)
      .then(usuario => {
        // Se não foi usuario = Acesso não autorizado
        if (!usuario) return res.sendStatus(401)
        // Se não usuario não tiver loja cadastrada = Acesso não autorizado
        if (!usuario.loja) return res.sendStatus(401)
        // Se não usuario não foi admin = Acesso não autorizado
        if (!usuario.permissao.includes('admin')) return res.sendStatus(401)
        // Se a loja que usuario esta cadastrado não for a loja que ele está querendo alterar = Acesso não autorizado
        if (usuario.loja.toString() !== loja) return res.sendStatus(401)
        next()
      }).catch(next)
  },

  show: {
    params: {
      id: Joi.string().alphanum().length(24).required()
    }
  },

  store: {
    body: {
      nome: Joi.string().required(),
      cnpj: Joi.string().length(18).required(),
      email: Joi.string().email().required(),
      telefones: Joi.array().items(Joi.string()).required(),
      endereco: Joi.object({
        local: Joi.string().required(),
        numero: Joi.string().required(),
        complemento: Joi.string().optional(),
        bairro: Joi.string().required(),
        cidade: Joi.string().required(),
        CEP: Joi.string().required(),
      }).required()
    }
  },

  update: {
    body: {
      nome: Joi.string().optional(),
      cnpj: Joi.string().length(18).optional(),
      email: Joi.string().email().optional(),
      telefones: Joi.array().items(Joi.string()).optional(),
      endereco: Joi.object({
        local: Joi.string().required(),
        numero: Joi.string().required(),
        complemento: Joi.string().optional(),
        bairro: Joi.string().required(),
        cidade: Joi.string().required(),
        CEP: Joi.string().required(),
      }).optional()
    }
  }
}

module.exports = { LojaValidation }