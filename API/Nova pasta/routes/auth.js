// Descrição: Arquivo responsável por fazer a autenticação com jwt

const jwt = require('express-jwt')
const secret = require('../config').secret

function getTokenFromHeader(req) {
  // Verifica se o token foi passado
  if(!req.headers.authorization) return null

  // Caso seja passado captura o token
  const token = req.headers.authorization.split(' ')
  // Caso a primeira parte seja diferente de 'Token' retorna null
  if(token[0] !== 'Token') return null
  
  // Se tudo for correto retorna o token
  return token[1];
}

const auth = {
  required: jwt({
    secret,
    userProperty: 'payload',
    getToken: getTokenFromHeader,
    algorithms: ['sha1', 'RS256', 'HS256'],
  }),
  optional: jwt({
    secret,
    userProperty: 'payload',
    credentialsRequired: false,
    getToken: getTokenFromHeader,
    algorithms: ['sha1', 'RS256', 'HS256'],
  }),
}

module.exports = auth