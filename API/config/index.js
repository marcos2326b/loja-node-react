module.exports = {
  secret: process.env.NODE_ENV === 'production' ? process.env.SECRET : 'NUI32H89H2NBH32HJBQAAS2HJB2J92J0H9J29VJNDSNBNBS4J23J9H2H2H23JHI32J',
  api: process.env.NODE_ENV === 'production' ? 'https://api.loja-teste.ampliee.com' : 'http://localhost:3000'
  loja: process.env.NODE_ENV === 'production' ? 'https://loja-teste.ampliee.com' : 'http://localhost:8000'
}