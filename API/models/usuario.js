// Descrição: Arquivo responsável pelo modelo do usuario

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const uniqueValidator = require('mongoose-unique-validator')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const secret = require('../config').secret

// Schema do usuario
const UsuarioSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, "não pode ficar vazio."]
  },
  email: {
    type: String,
    lowercase: true,
    unique: true,
    required: [true, "não pode ficar vazio."],
    index: true,
    // Verificação do email
    match: [/\S+@\S+\.\S+/, 'é inválido.']
  },
  loja: {
    type: Schema.Types.ObjectId,
    ref: "Loja",
    required: [true, "não pode ficar vazia."]
  },
  permissao: {
    type: Array,
    // Por padrão um usuario será cliente
    default: ["cliente"]
  },
  hash: { type: String },
  salt: { type: String },
  recovery: {
    type: {
      token: String,
      date: Date
    },
    default: {}
  }
}, { timestamps: true });

UsuarioSchema.plugin(uniqueValidator, { message: "já está sendo utilizado" });

// Gerar hash da senha
UsuarioSchema.methods.setSenha = function (password) {
  this.salt = crypto.randomBytes(16).toString("hex");
  this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, "sha512").toString("hex");
};

// Verificar hash para validação da senha
UsuarioSchema.methods.validarSenha = function (password) {
  const hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, "sha512").toString("hex");
  // Se o hash que geramos for igual a senha que salvamos a senha digitada é correta
  return hash === this.hash
}

UsuarioSchema.methods.gerarToken = function () {
  const today = new Date()
  const exp = new Date(today)
  // A cada 15 dias um novo token será gerado
  exp.setDate(today.getDate() + 15)

  return jwt.sign({
    id: this._id,
    nome: this.nome,
    email: this.email,
    exp: parseFloat(exp.getTime() / 1000, 10)
  }, secret);
}

// Retorna os dados
UsuarioSchema.methods.enviarAuthJSON = function () {
  return {
    _id: this._id,
    nome: this.nome,
    email: this.email,
    loja: this.loja,
    role: this.permissao,
    token: this.gerarToken()
  };
};

// Recuperação de senha do user
UsuarioSchema.methods.criarTokenRecuperacaoSenha = function () {
  this.recovery = {}
  this.recovery.token = crypto.randomBytes(16).toString('hex')
  // Token valido por um dia
  this.recovery.date = new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
  return this.recovery
}

UsuarioSchema.methods.finalizarTokenRecuperacaoSenha = function () {
  // Setta como null os valores do token
  this.recovery = { token: null, date: null }
  return this.recovery
}

module.exports = mongoose.model('Usuario', UsuarioSchema)